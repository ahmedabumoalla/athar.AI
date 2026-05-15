import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY غير موجود" },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader || authHeader === "Bearer undefined") {
      return NextResponse.json(
        { error: "جلسة المستخدم غير موجودة" },
        { status: 401 }
      );
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
      return NextResponse.json(
        { error: userError?.message || "تعذر التحقق من المستخدم" },
        { status: 401 }
      );
    }

    const email = user.email;

    const { data: profile, error: profileError } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "ملف الطالب غير موجود" },
        { status: 404 }
      );
    }

    const { data: analysis } = await supabase
      .from("academic_analyses")
      .select("*")
      .eq("student_email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const prompt = `
أنت مستشار أكاديمي في منصة أثر AI

مهمتك اقتراح أنشطة تدريبية مجانية ومباشرة بناء على احتياج الطالب
لا تقترح أنشطة عامة
كل نشاط لازم يكون له رابط مفتوح المصدر حقيقي ومباشر
لا تستخدم نقاط في نهاية الجمل
أرجع JSON فقط بدون شرح

بيانات الطالب:
الاسم: ${profile.full_name}
التخصص: ${profile.major}
المستوى: ${profile.level}
المعدل: ${profile.gpa}
المواد الصعبة: ${profile.weak_subjects}
المواد القوية: ${profile.strong_subjects}
الهدف: ${profile.goal}
أسلوب التعلم: ${profile.learning_style}

التحليل:
${JSON.stringify(analysis || {})}

أرجع بهذا الشكل فقط:
{
  "activities": [
    {
      "title": "اسم النشاط",
      "subject": "المادة",
      "activity_type": "نوع النشاط",
      "duration": "المدة",
      "level": "مبتدئ أو متوسط أو متقدم",
      "goal": "لماذا هذا النشاط مناسب للطالب",
      "source": "اسم المصدر",
      "url": "رابط مباشر",
      "importance_score": 85
    }
  ]
}

الشروط:
- اقترح 6 أنشطة فقط
- المصادر تكون من Khan Academy أو MIT OpenCourseWare أو OpenStax أو YouTube أو PhET أو Pauls Online Math Notes
- الرابط لازم يكون مباشر ومجاني
- اربط كل نشاط بمادة ضعف أو هدف واضح
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const parsed = JSON.parse(response.output_text);
    const activities = parsed.activities || [];

    await supabase
      .from("academic_activities")
      .delete()
      .eq("student_email", email)
      .eq("source_type", "ai");

    const rows = activities.map((item: any) => ({
      student_email: email,
      title: item.title,
      subject: item.subject,
      activity_type: item.activity_type,
      duration: item.duration,
      level: item.level,
      goal: item.goal,
      source: item.source,
      url: item.url,
      importance_score: item.importance_score || 70,
      completed: false,
      completed_at: null,
      level_impact: 0,
      source_type: "ai",
    }));

    const { data, error } = await supabase
      .from("academic_activities")
      .insert(rows)
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ activities: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "فشل توليد الأنشطة" },
      { status: 500 }
    );
  }
}