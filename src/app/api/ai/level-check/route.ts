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

    const { data: activities } = await supabase
      .from("academic_activities")
      .select("*")
      .eq("student_email", email);

    const { data: courses } = await supabase
      .from("course_recommendations")
      .select("*")
      .eq("student_email", email);

    const completedActivities =
      activities?.filter((item) => item.completed).length || 0;

    const completedCourses =
      courses?.filter((item) => item.attended).length || 0;

    const totalActivities = activities?.length || 0;
    const totalCourses = courses?.length || 0;

    const commitmentPercent =
      totalActivities + totalCourses > 0
        ? Math.round(
            ((completedActivities + completedCourses) /
              (totalActivities + totalCourses)) *
              100
          )
        : 0;

    const activitiesImpact =
      activities?.reduce(
        (acc, item) => acc + (item.level_impact || 0),
        0
      ) || 0;

    const coursesImpact =
      courses?.reduce(
        (acc, item) => acc + (item.level_impact || 0),
        0
      ) || 0;

    const totalImpact = activitiesImpact + coursesImpact;

    const prompt = `
أنت محلل أكاديمي داخل منصة أثر AI

قم بتحليل مستوى الطالب الحقيقي بناء على:
- مدى التزامه
- الأنشطة التي أنجزها
- الدورات التي حضرها
- مستوى تقدمه
- المواد التي يعاني منها

اكتب بالعربية الطبيعية
لا تستخدم نقاط في نهاية الجمل
لا تقل أنك ذكاء اصطناعي
لا تكن محبطًا
كن واقعيًا وتحفيزيًا

بيانات الطالب:
الاسم: ${profile?.full_name}
التخصص: ${profile?.major}
المستوى: ${profile?.level}
المعدل: ${profile?.gpa}
المواد الصعبة: ${profile?.weak_subjects}
المواد القوية: ${profile?.strong_subjects}
الهدف: ${profile?.goal}

إحصائيات التقدم:
عدد الأنشطة: ${totalActivities}
الأنشطة المكتملة: ${completedActivities}

عدد الدورات: ${totalCourses}
الدورات المكتملة: ${completedCourses}

نسبة الالتزام: ${commitmentPercent}%
التأثير الكلي: ${totalImpact}

أرجع JSON فقط بهذا الشكل:
{
  "status": "وصف المستوى الحالي",
  "score_percent": 75,
  "commitment_percent": 80,
  "strengths": [
    "نقطة قوة"
  ],
  "weaknesses": [
    "نقطة ضعف"
  ],
  "advice": [
    "نصيحة عملية"
  ],
  "ai_message": "رسالة تحليلية متوازنة"
}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const parsed = JSON.parse(response.output_text);

    await supabase
      .from("level_checks")
      .delete()
      .eq("student_email", email);

    await supabase.from("level_checks").insert({
      student_email: email,
      commitment_percent: parsed.commitment_percent,
      score_percent: parsed.score_percent,
      ai_status: parsed.status,
      ai_advice: parsed.ai_message,
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "فشل تحليل المستوى",
      },
      {
        status: 500,
      }
    );
  }
}