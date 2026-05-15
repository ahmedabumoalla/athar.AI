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
            <div className="text-xs text-[#667085]">
              التدقيق الذكي للمستوى
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <section className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
          <p className="mb-4 inline-flex rounded-full border border-[#BFDBFE] bg-[#EFF6FF]/90 px-4 py-1.5 text-xs font-semibold text-[#1D4ED8] shadow-sm backdrop-blur">
            تحليل فعلي يعتمد على تقدمك الحقيقي
          </p>

          <h1 className="max-w-4xl text-3xl font-black leading-snug text-[#111827] md:text-5xl md:leading-tight">
            تقييم ذكي لمستواك الأكاديمي الحالي
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#5B6472] md:text-base">
            يتم تحليل مدى التزامك بالدورات والأنشطة وتأثيرها على تقدمك الأكاديمي الحقيقي داخل المنصة
          </p>

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="mt-8 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] px-6 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8] disabled:opacity-50"
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
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
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
                icon={<TrendingUp className="h-5 w-5 text-[#10B981]" />}
              />

              <Card
                title="نسبة الالتزام"
                value={`${result.commitment_percent}%`}
                icon={<CheckCircle2 className="h-5 w-5 text-[#1D4ED8]" />}
              />

              <Card
                title="الحالة الحالية"
                value={result.status}
                icon={<Target className="h-5 w-5 text-[#F59E0B]" />}
              />
            </section>

            <section className="mt-6 rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
              <h2 className="text-xl font-black text-[#172033]">
                تحليل أثر AI
              </h2>

              <p className="mt-4 text-sm leading-loose text-[#5B6472]">
                {result.ai_message}
              </p>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-3">
              <Box
                title="نقاط القوة"
                icon={<CheckCircle2 className="h-5 w-5 text-[#10B981]" />}
                items={result.strengths}
              />

              <Box
                title="نقاط تحتاج تحسين"
                icon={<XCircle className="h-5 w-5 text-[#EF4444]" />}
                items={result.weaknesses}
              />

              <Box
                title="توصيات عملية"
                icon={<Sparkles className="h-5 w-5 text-[#1D4ED8]" />}
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
    <div className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2">
        {icon}

        <p className="text-sm font-bold text-[#667085]">
          {title}
        </p>
      </div>

      <h3 className="text-3xl font-black text-[#172033]">
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
    <div className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-2">
        {icon}

        <h2 className="text-lg font-black text-[#172033]">
          {title}
        </h2>
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