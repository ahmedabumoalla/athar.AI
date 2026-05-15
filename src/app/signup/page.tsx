"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type FormData = {
  email: string;
  password: string;
  fullName: string;
  username: string;
  university: string;
  major: string;
  level: string;
  gpa: string;
  weakSubjects: string;
  strongSubjects: string;
  goal: string;
  studyHours: string;
  learningStyle: string;
};

const initialData: FormData = {
  email: "",
  password: "",
  fullName: "",
  username: "",
  university: "",
  major: "",
  level: "",
  gpa: "",
  weakSubjects: "",
  strongSubjects: "",
  goal: "",
  studyHours: "",
  learningStyle: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function buildAnalysis() {
    return {
      status: "ملف جديد يحتاج متابعة أولية",
      strengths: form.strongSubjects
        ? [`يمتلك مؤشرات قوة في: ${form.strongSubjects}`]
        : ["لم يتم تحديد نقاط القوة بعد"],
      weaknesses: form.weakSubjects
        ? [`يحتاج متابعة في: ${form.weakSubjects}`]
        : ["لم يتم تحديد نقاط الضعف بعد"],
      recommendedSubjects: form.weakSubjects
        ? form.weakSubjects
            .split("،")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      recommendedCourses: [
        "دورة مهارات التعلم الجامعي",
        "دورة إدارة الوقت والمذاكرة الفعالة",
        "دورة تأسيسية حسب المواد التي تحتاج تحسين",
      ],
      exercises: [
        "حل تمارين قصيرة أسبوعيًا",
        "تلخيص كل محاضرة بعد حضورها",
        "اختبار ذاتي نهاية كل أسبوع",
      ],
    };
  }

  async function handleSignup() {
    setLoading(true);
    setMessage("");

    if (!form.email || !form.password || !form.fullName || !form.username) {
      setMessage("فضلاً عبّئ الإيميل وكلمة المرور والاسم واسم المستخدم");
      setLoading(false);
      return;
    }

    const analysis = buildAnalysis();

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          username: form.username,
        },
      },
    });

    if (authError) {
      setMessage(authError.message);
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("student_profiles")
      .insert({
        email: form.email,
        full_name: form.fullName,
        username: form.username,
        university: form.university,
        major: form.major,
        level: form.level,
        gpa: form.gpa,
        weak_subjects: form.weakSubjects,
        strong_subjects: form.strongSubjects,
        goal: form.goal,
        study_hours: form.studyHours,
        learning_style: form.learningStyle,
        started_at: new Date().toISOString(),
      });

    if (profileError) {
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    await supabase.from("academic_analyses").insert({
      student_email: form.email,
      status: analysis.status,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      recommended_subjects: analysis.recommendedSubjects,
      recommended_courses: analysis.recommendedCourses,
      exercises: analysis.exercises,
    });

    localStorage.setItem("athar_ai_current_email", form.email);

    router.push("/dashboard");
  }

  return (
    <div
      dir="rtl"
      className="relative min-h-dvh overflow-hidden bg-[#F6F8FB] text-[#172033]"
    >
      <img
        src="/images/athar-background.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-white/60" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.55),transparent_52%),radial-gradient(ellipse_at_50%_100%,rgba(37,99,235,0.08),transparent_45%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/brand/athar-logo-color.png"
            alt="أثر AI"
            className="h-28 w-auto object-contain"
          />

          
        </Link>

        <Link
          href="/login"
          className="rounded-2xl border border-[#D7DEE8] bg-white/80 px-5 py-2.5 text-sm font-bold text-[#1E3A8A] shadow-sm backdrop-blur transition hover:bg-white"
        >
          تسجيل الدخول
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-5 pb-16 pt-4 md:px-10">
        <section className="rounded-[2rem] border border-white/70 bg-white/82 p-7 shadow-[0_24px_80px_rgba(15,30,58,0.12)] backdrop-blur-xl">
          <p className="mb-4 inline-flex rounded-full border border-[#BFDBFE] bg-[#EFF6FF]/90 px-4 py-1.5 text-xs font-semibold text-[#1D4ED8]">
            إنشاء حساب طالب جديد
          </p>

          <h1 className="text-3xl font-black leading-snug tracking-tight text-[#111827] md:text-5xl">
            أنشئ حسابك الأكاديمي
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-[#5B6472]">
            عبّئ بياناتك الأساسية وسيتم حفظ ملفك الأكاديمي وتحليل حالتك داخل
            المنصة
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Input
              label="الإيميل"
              value={form.email}
              onChange={(v) => updateField("email", v)}
            />

            <Input
              label="كلمة المرور"
              value={form.password}
              onChange={(v) => updateField("password", v)}
              type="password"
            />

            <Input
              label="الاسم الكامل"
              value={form.fullName}
              onChange={(v) => updateField("fullName", v)}
            />

            <Input
              label="اسم المستخدم"
              value={form.username}
              onChange={(v) => updateField("username", v)}
            />

            <Input
              label="الجامعة"
              value={form.university}
              onChange={(v) => updateField("university", v)}
            />

            <Input
              label="التخصص"
              value={form.major}
              onChange={(v) => updateField("major", v)}
            />

            <Input
              label="المستوى الدراسي"
              value={form.level}
              onChange={(v) => updateField("level", v)}
            />

            <Input
              label="المعدل الحالي"
              value={form.gpa}
              onChange={(v) => updateField("gpa", v)}
            />
          </div>

          <div className="mt-4 grid gap-4">
            <Input
              label="المواد التي تشعر أنها صعبة عليك"
              value={form.weakSubjects}
              onChange={(v) => updateField("weakSubjects", v)}
            />

            <Input
              label="المواد التي تتميز فيها"
              value={form.strongSubjects}
              onChange={(v) => updateField("strongSubjects", v)}
            />

            <Input
              label="هدفك الأكاديمي هذا الترم"
              value={form.goal}
              onChange={(v) => updateField("goal", v)}
            />

            <Input
              label="كم ساعة تذاكر أسبوعيًا؟"
              value={form.studyHours}
              onChange={(v) => updateField("studyHours", v)}
            />

            <Input
              label="كيف تتعلم بشكل أفضل؟"
              value={form.learningStyle}
              onChange={(v) => updateField("learningStyle", v)}
            />
          </div>

          {message && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {message}
            </div>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[#1E3A8A] text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8] disabled:opacity-50"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب والدخول"}
          </button>
        </section>
      </main>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-[#667085]">
        {label}
      </span>

      <input
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-[#D7DEE8] bg-white/80 px-4 text-sm text-[#172033] shadow-sm outline-none transition placeholder:text-[#94A3B8] focus:border-[#93C5FD] focus:bg-white"
      />
    </label>
  );
}