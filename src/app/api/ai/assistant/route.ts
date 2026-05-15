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
        { error: "OPENAI_API_KEY غير موجود في .env.local" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    if (!authHeader || authHeader === "Bearer undefined") {
      return NextResponse.json(
        { error: "جلسة المستخدم غير موجودة سجل دخول مرة ثانية" },
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

    const { data: profile, error: profileError } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("email", user.email)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: profileError?.message || "ملف الطالب غير موجود" },
        { status: 404 }
      );
    }

    const { data: analysis } = await supabase
      .from("academic_analyses")
      .select("*")
      .eq("student_email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const prompt = `
أنت مساعد أكاديمي داخل منصة أثر AI

اكتب بالعربية بأسلوب طبيعي ومختصر
لا تضع نقاط في نهاية الجمل
لا تقل أنك ذكاء اصطناعي
لا تستخدم تنسيق مبالغ
لا تقدم وعود مؤكدة
ركز على الإرشاد الأكاديمي فقط

بيانات الطالب
الاسم: ${profile.full_name}
التخصص: ${profile.major}
المستوى: ${profile.level}
المعدل: ${profile.gpa}
المواد الصعبة: ${profile.weak_subjects}
المواد القوية: ${profile.strong_subjects}
الهدف الأكاديمي: ${profile.goal}
أسلوب التعلم: ${profile.learning_style}

التحليل الحالي
${JSON.stringify(analysis || {})}

سؤال الطالب
${body.message}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return NextResponse.json({
      reply: response.output_text || "لم أستطع تكوين رد مناسب حاليًا",
    });
  } catch (error: any) {
    console.error("ASSISTANT_API_ERROR", error);

    return NextResponse.json(
      {
        error: error?.message || "حدث خطأ غير معروف في المساعد",
      },
      { status: 500 }
    );
  }
}