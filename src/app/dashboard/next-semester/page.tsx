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
    <div
      dir="rtl"
      className="relative min-h-dvh overflow-hidden bg-[#F6F8FB] text-[#172033]"
    >
      <img
        src="/images/athar-background.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-45"
      />

      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.65),transparent_52%),radial-gradient(ellipse_at_50%_100%,rgba(37,99,235,0.08),transparent_45%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-2 text-sm font-bold text-[#1E3A8A] shadow-sm backdrop-blur transition hover:bg-white"
        >
          <ArrowRight className="h-4 w-4" />
          الرجوع للداش بورد
        </Link>

        <div className="flex items-center gap-3">
          <img
            src="/brand/athar-logo-color.png"
            alt="أثر AI"
            className="h-16 w-auto object-contain"
          />

          <div>
            <div className="text-xs text-[#667085]">مواد الترم القادم</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
            <p className="mb-4 inline-flex rounded-full border border-[#BFDBFE] bg-[#EFF6FF]/90 px-4 py-1.5 text-xs font-semibold text-[#1D4ED8] shadow-sm backdrop-blur">
              خطة مبنية على بياناتك
            </p>

            <h1 className="max-w-3xl text-3xl font-black leading-snug text-[#111827] md:text-5xl md:leading-tight">
              مواد الترم القادم وخطة رحلتك الأكاديمية
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5B6472]">
              يتم اقتراح المواد بناء على مستواك الحالي ونتائج التحليل والتزامك داخل المنصة
            </p>

            <button
              onClick={generatePlan}
              disabled={loading}
              className="mt-8 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] px-6 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="h-4 w-4" />
              )}

              {loading ? "جاري بناء الخطة" : "بناء خطة الترم القادم"}
            </button>

            {message && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {message}
              </div>
            )}
          </div>

          {result && (
            <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-[#1D4ED8]" />

                <h2 className="text-lg font-black text-[#172033]">
                  توصية أثر AI
                </h2>
              </div>

              <p className="text-sm leading-loose text-[#5B6472]">
                {result.summary}
              </p>

              <div className="mt-5 grid gap-3">
                <Info
                  icon={<Layers3 className="h-5 w-5" />}
                  title="الحمل المقترح"
                  value={result.recommended_load}
                />

                <Info
                  icon={<GraduationCap className="h-5 w-5" />}
                  title="استراتيجية التسجيل"
                  value={result.strategy}
                />
              </div>
            </div>
          )}
        </section>

        {result && (
          <>
            <section className="mt-6">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#1D4ED8]" />

                <h2 className="text-xl font-black text-[#172033]">
                  المواد المقترحة
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {result.subjects.map((subject) => (
                  <div
                    key={subject.title}
                    className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#BFDBFE] hover:bg-white"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF6FF] ring-1 ring-[#DBEAFE]">
                      <GraduationCap className="h-5 w-5 text-[#1E3A8A]" />
                    </div>

                    <h3 className="text-lg font-black text-[#172033]">
                      {subject.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#667085]">
                      {subject.reason}
                    </p>

                    <div className="mt-5 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 p-3">
                      <p className="text-xs text-[#64748B]">الأثر المتوقع</p>

                      <p className="mt-2 text-sm font-bold leading-relaxed text-[#4B5563]">
                        {subject.impact}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-xs font-bold text-[#1D4ED8]">
                        {subject.priority}
                      </span>

                      <span className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 px-3 py-2 text-xs text-[#667085]">
                        {subject.hours}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#10B981]" />

                  <h2 className="text-lg font-black text-[#172033]">
                    قواعد التسجيل
                  </h2>
                </div>

                <div className="space-y-3">
                  {result.rules.map((rule) => (
                    <div
                      key={rule}
                      className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 p-4 text-sm leading-relaxed text-[#4B5563]"
                    >
                      {rule}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
                <div className="mb-6 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#1D4ED8]" />

                  <h2 className="text-lg font-black text-[#172033]">
                    رحلة الترم القادم
                  </h2>
                </div>

                <div className="space-y-4">
                  {result.journey.map((step, index) => (
                    <div
                      key={step.title}
                      className="flex gap-4 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E3A8A] text-sm font-black text-white">
                        {index + 1}
                      </div>

                      <div>
                        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                          <h3 className="text-sm font-black text-[#172033]">
                            {step.title}
                          </h3>

                          <p className="text-xs font-bold text-[#1D4ED8]">
                            {step.period}
                          </p>
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-[#667085]">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-white/70 bg-white/82 p-6 text-center shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
              <CheckCircle2 className="mx-auto h-8 w-8 text-[#10B981]" />

              <h2 className="mt-3 text-xl font-black text-[#172033]">
                الخلاصة
              </h2>

              <p className="mx-auto mt-3 max-w-3xl text-sm leading-loose text-[#5B6472]">
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
    <div className="flex items-center gap-3 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 p-4">
      <div className="text-[#1D4ED8]">{icon}</div>

      <div>
        <p className="text-xs text-[#64748B]">{title}</p>

        <p className="mt-1 text-sm font-bold text-[#172033]">{value}</p>
      </div>
    </div>
  );
}