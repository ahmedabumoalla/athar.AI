"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";

type Result = {
  status: string;
  score_percent: number;
  commitment_percent: number;
  strengths: string[];
  weaknesses: string[];
  advice: string[];
  ai_message: string;
};

export default function LevelCheckPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState("");

  async function runAnalysis() {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      const response = await fetch("/api/ai/level-check", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل تحليل المستوى");
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
            <div className="text-xs text-white/60">
              التدقيق الذكي للمستوى
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <section className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
            تحليل فعلي يعتمد على تقدمك الحقيقي
          </p>

          <h1 className="max-w-4xl text-3xl font-black leading-snug md:text-5xl md:leading-tight">
            تقييم ذكي لمستواك الأكاديمي الحالي
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
            يتم تحليل مدى التزامك بالدورات والأنشطة وتأثيرها على تقدمك الأكاديمي الحقيقي داخل المنصة
          </p>

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="mt-8 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-bold transition hover:bg-[#1D4ED8] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="h-4 w-4" />
            )}

            {loading
              ? "جاري تحليل المستوى"
              : "ابدأ تحليل المستوى"}
          </button>

          {message && (
            <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {message}
            </div>
          )}
        </section>

        {result && (
          <>
            <section className="mt-6 grid gap-5 md:grid-cols-3">
              <Card
                title="نسبة المستوى"
                value={`${result.score_percent}%`}
                icon={<TrendingUp className="h-5 w-5 text-[#86EFAC]" />}
              />

              <Card
                title="نسبة الالتزام"
                value={`${result.commitment_percent}%`}
                icon={<CheckCircle2 className="h-5 w-5 text-[#93C5FD]" />}
              />

              <Card
                title="الحالة الحالية"
                value={result.status}
                icon={<Target className="h-5 w-5 text-[#FCD34D]" />}
              />
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="text-xl font-black">
                تحليل أثر AI
              </h2>

              <p className="mt-4 text-sm leading-loose text-white/75">
                {result.ai_message}
              </p>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-3">
              <Box
                title="نقاط القوة"
                icon={<CheckCircle2 className="h-5 w-5 text-[#86EFAC]" />}
                items={result.strengths}
              />

              <Box
                title="نقاط تحتاج تحسين"
                icon={<XCircle className="h-5 w-5 text-[#FCA5A5]" />}
                items={result.weaknesses}
              />

              <Box
                title="توصيات عملية"
                icon={<Sparkles className="h-5 w-5 text-[#93C5FD]" />}
                items={result.advice}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <p className="text-sm font-bold text-white/65">
          {title}
        </p>
      </div>

      <h3 className="text-3xl font-black">
        {value}
      </h3>
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

        <h2 className="text-lg font-black">
          {title}
        </h2>
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