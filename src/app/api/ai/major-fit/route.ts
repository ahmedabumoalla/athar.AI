import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
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
        { error: "تعذر التحقق من المستخدم" },
        { status: 401 }
      );
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

    const { data: levelCheck } = await supabase
      .from("level_checks")
      .select("*")
      .eq("student_email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: activities } = await supabase
      .from("academic_activities")
      .select("*")
      .eq("student_email", email);

    const { data: courses } = await supabase
      .from("course_recommendations")
      .select("*")
      .eq("student_email", email);

    const prompt = `
أنت مستشار أكاديمي داخل منصة أثر AI

مهمتك تقييم ملاءمة التخصص الحالي للطالب
لا تكن محبطًا ولا مجاملًا
كن متوازنًا ومحفزًا وواقعيًا
لا تستخدم نقاط في نهاية الجمل
لا تقل أنك ذكاء اصطناعي
لا تعط قرار تغيير تخصص مباشر إلا إذا كانت المؤشرات قوية
اعتمد على بيانات الطالب وتقدمه والتزامه

بيانات الطالب:
الاسم: ${profile?.full_name}
التخصص الحالي: ${profile?.major}
المستوى: ${profile?.level}
المعدل: ${profile?.gpa}
نقاط القوة: ${profile?.strong_subjects}
نقاط الضعف: ${profile?.weak_subjects}
الهدف الأكاديمي: ${profile?.goal}
أسلوب التعلم: ${profile?.learning_style}

التحليل الأكاديمي:
${JSON.stringify(analysis || {})}

تدقيق المستوى:
${JSON.stringify(levelCheck || {})}

الأنشطة:
${JSON.stringify(activities || [])}

الدورات:
${JSON.stringify(courses || [])}

أرجع JSON فقط بهذا الشكل:
{
  "fit_score": 82,
  "decision": "قرار مختصر",
  "message": "رسالة متوازنة للطالب",
  "positive_signals": ["مؤشر إيجابي"],
  "risk_signals": ["مؤشر يحتاج انتباه"],
  "correction_plan": ["خطوة تصحيح مسار"],
  "recommended_paths": [
    {
      "title": "اسم المسار",
      "status": "الأقرب أو خيار بديل أو خيار داعم",
      "reason": "سبب الترشيح"
    }
  ],
  "final_recommendation": "الخلاصة النهائية"
}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const parsed = JSON.parse(response.output_text);

    await supabase
      .from("major_fit_results")
      .delete()
      .eq("student_email", email);

    await supabase.from("major_fit_results").insert({
      student_email: email,
      current_major: profile?.major,
      fit_score: parsed.fit_score,
      ai_decision: parsed.decision,
      ai_message: parsed.message,
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "فشل تحليل ملاءمة التخصص" },
      { status: 500 }
    );
  }
}