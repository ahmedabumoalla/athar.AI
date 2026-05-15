import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const { data: profile, error: profileError } = await supabase
      .from("student_profiles")
      .select(
        "full_name, major, level, gpa, weak_subjects, strong_subjects, goal, learning_style"
      )
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
      .select("status, strengths, weaknesses, recommended_subjects")
      .eq("student_email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: levelCheck } = await supabase
      .from("level_checks")
      .select("commitment_percent, score_percent, ai_status")
      .eq("student_email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const prompt = `
أنت مرشد أكاديمي داخل منصة أثر AI

مهمتك اقتراح مواد الترم القادم بناء على بيانات الطالب
كن واقعيًا ومتوازنًا ولا تقترح حملًا دراسيًا مرهقًا
لا تستخدم نقاط في نهاية الجمل
لا تقل أنك ذكاء اصطناعي
أرجع JSON فقط بدون أي نص خارج JSON

بيانات الطالب:
الاسم: ${profile.full_name}
التخصص: ${profile.major}
المستوى: ${profile.level}
المعدل: ${profile.gpa}
نقاط القوة: ${profile.strong_subjects}
نقاط الضعف: ${profile.weak_subjects}
الهدف: ${profile.goal}
أسلوب التعلم: ${profile.learning_style}

ملخص التحليل:
الحالة: ${analysis?.status || "غير متوفر"}
نقاط القوة: ${(analysis?.strengths || []).join("، ")}
نقاط الضعف: ${(analysis?.weaknesses || []).join("، ")}
مواد مقترحة سابقًا: ${(analysis?.recommended_subjects || []).join("، ")}

تدقيق المستوى:
نسبة الالتزام: ${levelCheck?.commitment_percent ?? "غير متوفر"}
نسبة المستوى: ${levelCheck?.score_percent ?? "غير متوفر"}
الحالة: ${levelCheck?.ai_status || "غير متوفر"}

أرجع بهذا الشكل:
{
  "summary": "ملخص خطة الترم القادم",
  "recommended_load": "الحمل المقترح",
  "strategy": "استراتيجية التسجيل",
  "subjects": [
    {
      "title": "اسم المادة",
      "hours": "عدد الساعات",
      "priority": "أولوية عالية أو متوسطة أو داعمة",
      "reason": "سبب اقتراح المادة",
      "impact": "الأثر المتوقع على الطالب"
    }
  ],
  "journey": [
    {
      "title": "مرحلة الرحلة",
      "period": "الفترة",
      "desc": "الوصف"
    }
  ],
  "rules": [
    "قاعدة تسجيل"
  ],
  "final_note": "خلاصة تحفيزية متوازنة"
}

الشروط:
- اقترح من 4 إلى 5 مواد فقط
- رحلة الترم تكون من 5 مراحل فقط
- قواعد التسجيل تكون 4 قواعد فقط
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const rawText = response.output_text || "";
    const jsonText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(jsonText);

    await supabase
      .from("next_semester_subjects")
      .delete()
      .eq("student_email", email);

    const rows = (parsed.subjects || []).map((subject: any) => ({
      student_email: email,
      title: subject.title,
      hours: subject.hours,
      priority: subject.priority,
      reason: subject.reason,
      impact: subject.impact,
    }));

    if (rows.length > 0) {
      const { error: insertError } = await supabase
        .from("next_semester_subjects")
        .insert(rows);

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("NEXT_SEMESTER_AI_ERROR", error);

    return NextResponse.json(
      {
        error: error?.message || "فشل اقتراح مواد الترم القادم",
      },
      {
        status: 500,
      }
    );
  }
}