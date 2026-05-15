"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  ExternalLink,
  Loader2,
  RefreshCcw,
  Search,
  Timer,
} from "lucide-react";

type Activity = {
  id: string;
  title: string;
  subject: string;
  activity_type: string;
  duration: string;
  level: string;
  goal: string;
  source: string;
  url: string;
  importance_score: number;
  completed: boolean;
  level_impact: number;
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    setLoading(true);

    const { data, error } = await supabase
      .from("academic_activities")
      .select("*")
      .order("importance_score", { ascending: false });

    if (!error && data) {
      setActivities(data);
    }

    setLoading(false);
  }

  async function generateActivities() {
    setGenerating(true);
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    const response = await fetch("/api/ai/activities", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "تعذر توليد الأنشطة");
      setGenerating(false);
      return;
    }

    setActivities(result.activities || []);
    setGenerating(false);
  }

  async function markCompleted(activity: Activity) {
    const impact = Math.max(3, Math.round(activity.importance_score / 20));

    const { error } = await supabase
      .from("academic_activities")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        level_impact: impact,
      })
      .eq("id", activity.id);

    if (!error) {
      setActivities((prev) =>
        prev.map((item) =>
          item.id === activity.id
            ? {
                ...item,
                completed: true,
                level_impact: impact,
              }
            : item
        )
      );
    }
  }

  const filtered = useMemo(() => {
    return activities.filter((item) => {
      const text = `${item.title} ${item.subject} ${item.activity_type} ${item.source}`;
      return text.toLowerCase().includes(search.toLowerCase());
    });
  }, [activities, search]);

  const completedCount = activities.filter((item) => item.completed).length;

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
            <div className="text-xs text-[#667085]">الأنشطة التدريبية</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
            <p className="mb-4 inline-flex rounded-full border border-[#BFDBFE] bg-[#EFF6FF]/90 px-4 py-1.5 text-xs font-semibold text-[#1D4ED8] shadow-sm backdrop-blur">
              أنشطة مخصصة حسب بياناتك
            </p>

            <h1 className="max-w-3xl text-3xl font-black leading-snug text-[#111827] md:text-5xl md:leading-tight">
              أنشطة عملية يقترحها أثر AI بناء على احتياجك
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5B6472] md:text-base">
              يتم اقتراح الأنشطة من مصادر مفتوحة ومجانية بناء على المواد التي تحتاج تحسين ومستوى تقدمك داخل المنصة
            </p>

            <button
              onClick={generateActivities}
              disabled={generating}
              className="mt-6 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] px-6 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              {generating ? "جاري توليد الأنشطة" : "توليد أنشطة مخصصة"}
            </button>

            {message && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {message}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
            <h2 className="text-lg font-black text-[#172033]">تقدم الأنشطة</h2>

            <div className="mt-5 grid gap-3">
              <Metric title="عدد الأنشطة" value={`${activities.length}`} />
              <Metric title="تم إنجازها" value={`${completedCount}`} />
              <Metric
                title="نسبة الالتزام"
                value={
                  activities.length
                    ? `${Math.round((completedCount / activities.length) * 100)}%`
                    : "0%"
                }
              />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/70 bg-white/82 p-5 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن نشاط أو مادة"
              className="h-12 w-full rounded-2xl border border-[#D7DEE8] bg-white/80 pr-11 pl-4 text-sm text-[#172033] shadow-sm outline-none placeholder:text-[#94A3B8] transition focus:border-[#93C5FD] focus:bg-white"
            />
          </div>
        </section>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#1E3A8A]" />
          </div>
        ) : (
          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((activity) => (
              <div
                key={activity.id}
                className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#BFDBFE] hover:bg-white"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF6FF] ring-1 ring-[#DBEAFE]">
                    <Dumbbell className="h-5 w-5 text-[#1E3A8A]" />
                  </div>

                  <div className="rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-xs font-black text-[#1D4ED8]">
                    أهمية {activity.importance_score}%
                  </div>
                </div>

                <h3 className="text-lg font-black text-[#172033]">
                  {activity.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#667085]">
                  {activity.goal}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Badge text={activity.subject} />
                  <Badge text={activity.activity_type} />
                  <Badge text={activity.level} />
                  <Badge text={activity.duration} />
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 px-3 py-2 text-xs text-[#667085]">
                  <Timer className="h-4 w-4 text-[#1E3A8A]" />
                  المصدر {activity.source}
                </div>

                <div className="mt-6 grid gap-2">
                  <a
                    href={activity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    افتح النشاط
                  </a>

                  <button
                    onClick={() => markCompleted(activity)}
                    disabled={activity.completed}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#D7DEE8] bg-white/80 text-sm font-bold text-[#1E3A8A] shadow-sm transition hover:bg-white disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {activity.completed
                      ? `تم الحضور ورفع التقييم +${activity.level_impact}`
                      : "تم حضور النشاط"}
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 p-4">
      <p className="text-xs text-[#64748B]">{title}</p>
      <p className="mt-2 text-lg font-black text-[#172033]">{value}</p>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 px-3 py-2 text-xs text-[#667085]">
      {text}
    </div>
  );
}