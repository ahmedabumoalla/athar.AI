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
  Sparkles,
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
            <div className="text-xs text-white/60">الأنشطة التدريبية</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
              أنشطة مخصصة حسب بياناتك
            </p>

            <h1 className="max-w-3xl text-3xl font-black leading-snug md:text-5xl md:leading-tight">
              أنشطة عملية يقترحها أثر AI بناء على احتياجك
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              يتم اقتراح الأنشطة من مصادر مفتوحة ومجانية بناء على المواد التي تحتاج تحسين ومستوى تقدمك داخل المنصة
            </p>

            <button
              onClick={generateActivities}
              disabled={generating}
              className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-bold transition hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              {generating ? "جاري توليد الأنشطة" : "توليد أنشطة مخصصة"}
            </button>

            {message && (
              <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {message}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <h2 className="text-lg font-black">تقدم الأنشطة</h2>

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

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن نشاط أو مادة"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 pr-11 pl-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#60A5FA]"
            />
          </div>
        </section>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white/60" />
          </div>
        ) : (
          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((activity) => (
              <div
                key={activity.id}
                className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-xl shadow-black/10 backdrop-blur transition hover:-translate-y-1 hover:bg-white/12"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                    <Dumbbell className="h-5 w-5 text-[#93C5FD]" />
                  </div>

                  <div className="rounded-2xl border border-[#60A5FA]/25 bg-[#2563EB]/35 px-3 py-1.5 text-xs font-black">
                    أهمية {activity.importance_score}%
                  </div>
                </div>

                <h3 className="text-lg font-black">{activity.title}</h3>

                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {activity.goal}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Badge text={activity.subject} />
                  <Badge text={activity.activity_type} />
                  <Badge text={activity.level} />
                  <Badge text={activity.duration} />
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
                  <Timer className="h-4 w-4" />
                  المصدر {activity.source}
                </div>

                <div className="mt-6 grid gap-2">
                  <a
                    href={activity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold transition hover:bg-[#1D4ED8]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    افتح النشاط
                  </a>

                  <button
                    onClick={() => markCompleted(activity)}
                    disabled={activity.completed}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 text-sm font-bold transition hover:bg-white/15 disabled:opacity-60"
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-white/50">{title}</p>
      <p className="mt-2 text-lg font-black text-white/85">{value}</p>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65">
      {text}
    </div>
  );
}