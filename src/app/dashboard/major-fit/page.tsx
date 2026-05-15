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
  Sparkles,
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
      className="relative min-h-dvh overflow-hidden bg-[#172554] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(37,99,235,0.35),transparent_55%),radial-gradient(ellipse_at_85%_20%,rgba(16,185,129,0.14),transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.08),transparent_45%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
        >
          <ArrowRight className="h-4 w-4" />
          الرجوع للداش بورد
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#172554] shadow-lg shadow-black/20 ring-1 ring-white/10">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <div className="text-sm font-extrabold">أثر AI</div>
            <div className="text-xs text-white/60">ملاءمة التخصص</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
              تقييم متوازن مبني على بياناتك
            </p>

            <h1 className="max-w-3xl text-3xl font-black leading-snug md:text-5xl md:leading-tight">
              هل تخصصك الحالي مناسب لك فعلًا
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              الصفحة تحلل التخصص بناء على أدائك والتزامك ونقاط قوتك وضعفك بدون مجاملة وبدون إحباط
            </p>

            <button
              onClick={runMajorFit}
              disabled={loading}
              className="mt-8 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-bold transition hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="h-4 w-4" />
              )}
              {loading ? "جاري تحليل التخصص" : "ابدأ تحليل ملاءمة التخصص"}
            </button>

            {message && (
              <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {message}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="mb-5 flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-[#93C5FD]" />
              <h2 className="text-lg font-black">فكرة الصفحة</h2>
            </div>

            <p className="text-sm leading-loose text-white/70">
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
              <div className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="mb-4 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-[#93C5FD]" />
                  <h2 className="text-lg font-black">نسبة ملاءمة التخصص</h2>
                </div>

                <div className="rounded-3xl border border-[#60A5FA]/25 bg-[#2563EB]/25 p-6 text-center">
                  <p className="text-6xl font-black">{result.fit_score}%</p>
                  <p className="mt-4 text-sm font-bold leading-relaxed text-white/80">
                    {result.decision}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="mb-4 flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-[#93C5FD]" />
                  <h2 className="text-lg font-black">القراءة المتوازنة</h2>
                </div>

                <p className="text-sm leading-loose text-white/75">
                  {result.message}
                </p>
              </div>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-3">
              <Box
                title="مؤشرات إيجابية"
                icon={<CheckCircle2 className="h-5 w-5 text-[#86EFAC]" />}
                items={result.positive_signals}
              />

              <Box
                title="مؤشرات تحتاج انتباه"
                icon={<TriangleAlert className="h-5 w-5 text-[#FDE68A]" />}
                items={result.risk_signals}
              />

              <Box
                title="خطة تصحيح المسار"
                icon={<Target className="h-5 w-5 text-[#93C5FD]" />}
                items={result.correction_plan}
              />
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="mb-5 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#93C5FD]" />
                <h2 className="text-lg font-black">المسارات المحتملة</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {result.recommended_paths.map((path) => (
                  <div
                    key={path.title}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5"
                  >
                    <h3 className="text-base font-black">{path.title}</h3>

                    <p className="mt-3 w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                      {path.status}
                    </p>

                    <p className="mt-4 text-sm leading-relaxed text-white/68">
                      {path.reason}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/8 p-6 text-center shadow-2xl shadow-black/20 backdrop-blur">
              <RefreshCcw className="mx-auto h-8 w-8 text-[#93C5FD]" />

              <h2 className="mt-3 text-xl font-black">الخلاصة</h2>

              <p className="mx-auto mt-3 max-w-3xl text-sm leading-loose text-white/70">
                {result.final_recommendation}
              </p>

              <Link
                href="/dashboard/next-semester"
                className="mx-auto mt-6 flex h-12 max-w-xs items-center justify-center rounded-xl bg-[#2563EB] text-sm font-bold transition hover:bg-[#1D4ED8]"
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
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
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
    <div className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="mb-5 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-black">{title}</h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/72"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}