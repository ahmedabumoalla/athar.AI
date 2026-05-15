import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.email;

    const { data: profile } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("email", email)
      .single();

    const { data: analysis } = await supabase
      .from("academic_analyses")
      .select("*")
      .eq("student_email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const prompt = `
أنت مستشار أكاديمي داخل منصة أثر AI
مهمتك اقتراح دورات مجانية ومفتوحة المصدر بناء على بيانات الطالب فقط
لا تعط دورات عامة بدون علاقة
لا تستخدم نقاط في نهاية الجمل
اجعل النتائج واقعية ومباشرة ومناسبة للمرحلة الجامعية

بيانات الطالب:
الاسم: ${profile.full_name}
التخصص: ${profile.major}
المستوى: ${profile.level}
المعدل: ${profile.gpa}
نقاط الضعف: ${profile.weak_subjects}
نقاط القوة: ${profile.strong_subjects}
الهدف الأكاديمي: ${profile.goal}
أسلوب التعلم: ${profile.learning_style}

التحليل الحالي:
${JSON.stringify(analysis || {})}

أرجع JSON فقط بهذا الشكل:
{
  "courses": [
    {
      "title": "اسم الدورة",
      "category": "تصنيف الدورة",
      "level": "مبتدئ أو متوسط أو متقدم",
      "duration": "مدة تقديرية",
      "match_score": 90,
      "importance_score": 85,
      "reason": "سبب الترشيح للطالب",
      "skills": ["مهارة 1", "مهارة 2"],
      "external_url": "رابط دورة مجانية مفتوحة المصدر"
    }
  ]
}

الشروط:
- اقترح 6 دورات فقط
- الروابط تكون من Khan Academy أو MIT OpenCourseWare أو OpenStax أو YouTube أو Coursera Free أو edX audit
- لا تضع رابط وهمي
- كل دورة لازم تكون مرتبطة بنقطة ضعف أو هدف واضح
`;

    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const text = completion.output_text;
    const parsed = JSON.parse(text);
    const courses = parsed.courses || [];

    await supabase
      .from("course_recommendations")
      .delete()
      .eq("student_email", email)
      .eq("source_type", "ai");

    const rows = courses.map((course: any) => ({
      student_email: email,
      title: course.title,
      category: course.category,
      level: course.level,
      duration: course.duration,
      match_score: course.match_score,
      importance_score: course.importance_score,
      reason: course.reason,
      skills: course.skills,
      external_url: course.external_url,
      source_type: "ai",
      attended: false,
      level_impact: 0,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("course_recommendations")
      .insert(rows)
      .select("*");

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ courses: inserted });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "AI course generation failed" },
      { status: 500 }
    );
  }
}