"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Layers3,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";

type Subject = {
  title: string;
  hours: string;
  priority: string;
  reason: string;
  impact: string;
};

type Journey = {
  title: string;
  period: string;
  desc: string;
};

type Result = {
  summary: string;
  recommended_load: string;
  strategy: string;
  subjects: Subject[];
  journey: Journey[];
  rules: string[];
  final_note: string;
};

export default function NextSemesterPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function generatePlan() {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      const response = await fetch("/api/ai/next-semester", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "تعذر إنشاء الخطة");
      }

      setResult(data);
    } catch (error: any) {
      setMessage(error.message);
    }

    setLoading(false);
  }

  return (
    <div dir="rtl" className="relative min-h-dvh overflow-hidden bg-[#172554] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(37,99,235,0.35),transparent_55%),radial-gradient(ellipse_at_85%_20%,rgba(16,185,129,0.14),transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.08),transparent_45%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-10">
        <Link href="/dashboard" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold transition hover:bg-white/10">
          <ArrowRight className="h-4 w-4" />
          الرجوع للداش بورد
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#172554] shadow-lg shadow-black/20 ring-1 ring-white/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold">أثر AI</div>
            <div className="text-xs text-white/60">مواد الترم القادم</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
              خطة مبنية على بياناتك
            </p>

            <h1 className="max-w-3xl text-3xl font-black leading-snug md:text-5xl md:leading-tight">
              مواد الترم القادم وخطة رحلتك الأكاديمية
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
              يتم اقتراح المواد بناء على مستواك الحالي ونتائج التحليل والتزامك داخل المنصة
            </p>

            <button
              onClick={generatePlan}
              disabled={loading}
              className="mt-8 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-bold transition hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
              {loading ? "جاري بناء الخطة" : "بناء خطة الترم القادم"}
            </button>

            {message && (
              <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {message}
              </div>
            )}
          </div>

          {result && (
            <div className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-[#93C5FD]" />
                <h2 className="text-lg font-black">توصية أثر AI</h2>
              </div>

              <p className="text-sm leading-loose text-white/70">{result.summary}</p>

              <div className="mt-5 grid gap-3">
                <Info icon={<Layers3 className="h-5 w-5" />} title="الحمل المقترح" value={result.recommended_load} />
                <Info icon={<GraduationCap className="h-5 w-5" />} title="استراتيجية التسجيل" value={result.strategy} />
              </div>
            </div>
          )}
        </section>

        {result && (
          <>
            <section className="mt-6">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#93C5FD]" />
                <h2 className="text-xl font-black">المواد المقترحة</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {result.subjects.map((subject) => (
                  <div key={subject.title} className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-xl shadow-black/10 backdrop-blur">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                      <GraduationCap className="h-5 w-5 text-[#93C5FD]" />
                    </div>

                    <h3 className="text-lg font-black">{subject.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">{subject.reason}</p>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs text-white/50">الأثر المتوقع</p>
                      <p className="mt-2 text-sm font-bold leading-relaxed text-white/75">{subject.impact}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="rounded-2xl border border-[#60A5FA]/25 bg-[#2563EB]/30 px-3 py-2 text-xs font-bold">
                        {subject.priority}
                      </span>
                      <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65">
                        {subject.hours}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#86EFAC]" />
                  <h2 className="text-lg font-black">قواعد التسجيل</h2>
                </div>

                <div className="space-y-3">
                  {result.rules.map((rule) => (
                    <div key={rule} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/70">
                      {rule}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="mb-6 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#93C5FD]" />
                  <h2 className="text-lg font-black">رحلة الترم القادم</h2>
                </div>

                <div className="space-y-4">
                  {result.journey.map((step, index) => (
                    <div key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-sm font-black">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                          <h3 className="text-sm font-black">{step.title}</h3>
                          <p className="text-xs font-bold text-[#93C5FD]">{step.period}</p>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/8 p-6 text-center shadow-2xl shadow-black/20 backdrop-blur">
              <CheckCircle2 className="mx-auto h-8 w-8 text-[#86EFAC]" />
              <h2 className="mt-3 text-xl font-black">الخلاصة</h2>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-loose text-white/70">
                {result.final_note}
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Info({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-[#93C5FD]">{icon}</div>
      <div>
        <p className="text-xs text-white/50">{title}</p>
        <p className="mt-1 text-sm font-bold text-white/80">{value}</p>
      </div>
    </div>
  );
}