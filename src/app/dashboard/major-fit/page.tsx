"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Compass,
  GraduationCap,
  HeartHandshake,
  Loader2,
  RefreshCcw,
  Target,
  TriangleAlert,
} from "lucide-react";

type Path = {
  title: string;
  status: string;
  reason: string;
};

type Result = {
  fit_score: number;
  decision: string;
  message: string;
  positive_signals: string[];
  risk_signals: string[];
  correction_plan: string[];
  recommended_paths: Path[];
  final_recommendation: string;
};

export default function MajorFitPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState("");

  async function runMajorFit() {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      const response = await fetch("/api/ai/major-fit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل تحليل التخصص");
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
            <div className="text-xs text-[#667085]">ملاءمة التخصص</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
            <p className="mb-4 inline-flex rounded-full border border-[#BFDBFE] bg-[#EFF6FF]/90 px-4 py-1.5 text-xs font-semibold text-[#1D4ED8] shadow-sm backdrop-blur">
              تقييم متوازن مبني على بياناتك
            </p>

            <h1 className="max-w-3xl text-3xl font-black leading-snug text-[#111827] md:text-5xl md:leading-tight">
              هل تخصصك الحالي مناسب لك فعلًا
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5B6472] md:text-base">
              الصفحة تحلل التخصص بناء على أدائك والتزامك ونقاط قوتك وضعفك بدون مجاملة وبدون إحباط
            </p>

            <button
              onClick={runMajorFit}
              disabled={loading}
              className="mt-8 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] px-6 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="h-4 w-4" />
              )}
              {loading ? "جاري تحليل التخصص" : "ابدأ تحليل ملاءمة التخصص"}
            </button>

            {message && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {message}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-[#1D4ED8]" />
              <h2 className="text-lg font-black text-[#172033]">
                فكرة الصفحة
              </h2>
            </div>

            <p className="text-sm leading-loose text-[#5B6472]">
              ليست الصفحة للحكم عليك أو تخويفك من تخصصك بل لمساعدتك تعرف هل التحدي طبيعي ويمكن تجاوزه أو أن المسار يحتاج تصحيحًا مدروسًا
            </p>

            <div className="mt-5 grid gap-3">
              <Info text="تحليل حسب بياناتك الحقيقية" />
              <Info text="يراعي التقدم والالتزام" />
              <Info text="يعطي بدائل بدون قرارات متسرعة" />
            </div>
          </div>
        </section>

        {result && (
          <>
            <section className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-[#1D4ED8]" />
                  <h2 className="text-lg font-black text-[#172033]">
                    نسبة ملاءمة التخصص
                  </h2>
                </div>

                <div className="rounded-3xl border border-[#BFDBFE] bg-[#EFF6FF]/90 p-6 text-center">
                  <p className="text-6xl font-black text-[#1E3A8A]">
                    {result.fit_score}%
                  </p>
                  <p className="mt-4 text-sm font-bold leading-relaxed text-[#4B5563]">
                    {result.decision}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-[#1D4ED8]" />
                  <h2 className="text-lg font-black text-[#172033]">
                    القراءة المتوازنة
                  </h2>
                </div>

                <p className="text-sm leading-loose text-[#5B6472]">
                  {result.message}
                </p>
              </div>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-3">
              <Box
                title="مؤشرات إيجابية"
                icon={<CheckCircle2 className="h-5 w-5 text-[#10B981]" />}
                items={result.positive_signals}
              />

              <Box
                title="مؤشرات تحتاج انتباه"
                icon={<TriangleAlert className="h-5 w-5 text-[#F59E0B]" />}
                items={result.risk_signals}
              />

              <Box
                title="خطة تصحيح المسار"
                icon={<Target className="h-5 w-5 text-[#1D4ED8]" />}
                items={result.correction_plan}
              />
            </section>

            <section className="mt-6 rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#1D4ED8]" />
                <h2 className="text-lg font-black text-[#172033]">
                  المسارات المحتملة
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {result.recommended_paths.map((path) => (
                  <div
                    key={path.title}
                    className="rounded-3xl border border-[#E5EAF1] bg-[#F8FAFC]/90 p-5"
                  >
                    <h3 className="text-base font-black text-[#172033]">
                      {path.title}
                    </h3>

                    <p className="mt-3 w-fit rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#1D4ED8]">
                      {path.status}
                    </p>

                    <p className="mt-4 text-sm leading-relaxed text-[#667085]">
                      {path.reason}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-white/70 bg-white/82 p-6 text-center shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
              <RefreshCcw className="mx-auto h-8 w-8 text-[#1D4ED8]" />

              <h2 className="mt-3 text-xl font-black text-[#172033]">
                الخلاصة
              </h2>

              <p className="mx-auto mt-3 max-w-3xl text-sm leading-loose text-[#5B6472]">
                {result.final_recommendation}
              </p>

              <Link
                href="/dashboard/next-semester"
                className="mx-auto mt-6 flex h-12 max-w-xs items-center justify-center rounded-2xl bg-[#1E3A8A] text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8]"
              >
                بناء خطة الترم القادم
              </Link>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Info({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 px-4 py-3 text-sm text-[#667085]">
      {text}
    </div>
  );
}

function Box({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-black text-[#172033]">{title}</h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 px-4 py-3 text-sm leading-relaxed text-[#4B5563]"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}