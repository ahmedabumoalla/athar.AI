"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  Activity,
  BookOpen,
  Bot,
  CalendarDays,
  GraduationCap,
  LineChart,
  Loader2,
  LogOut,
  Map,
  Target,
  UserRound,
  Zap,
} from "lucide-react";

type StudentProfile = {
  email: string;
  full_name: string;
  username: string;
  university: string | null;
  major: string | null;
  level: string | null;
  gpa: string | null;
  weak_subjects: string | null;
  strong_subjects: string | null;
  goal: string | null;
  study_hours: string | null;
  learning_style: string | null;
  started_at: string;
};

type AcademicAnalysis = {
  status: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  recommended_subjects: string[] | null;
};

type JourneyItem = {
  title: string;
  status: string;
  active: boolean;
  sort_order: number;
};

const defaultJourney: JourneyItem[] = [
  {
    title: "بناء الملف الأكاديمي",
    status: "مكتمل",
    active: true,
    sort_order: 1,
  },
  {
    title: "تحليل المستوى الحالي",
    status: "قيد التنفيذ",
    active: true,
    sort_order: 2,
  },
  {
    title: "خطة تحسين هذا الترم",
    status: "قادم",
    active: false,
    sort_order: 3,
  },
  {
    title: "رفع المعدل والاستقرار",
    status: "قادم",
    active: false,
    sort_order: 4,
  },
  {
    title: "جاهزية أكاديمية متقدمة",
    status: "قادم",
    active: false,
    sort_order: 5,
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [analysis, setAnalysis] = useState<AcademicAnalysis | null>(null);
  const [journey, setJourney] = useState<JourneyItem[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session?.user?.email) {
        router.push("/login");
        return;
      }

      const email = session.user.email;
      setUserEmail(email);

      const { data: profileData, error: profileError } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (profileError || !profileData) {
        setLoading(false);
        return;
      }

      const { data: analysisData } = await supabase
        .from("academic_analyses")
        .select("*")
        .eq("student_email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: journeyData } = await supabase
        .from("student_journeys")
        .select("title,status,active,sort_order")
        .eq("student_email", email)
        .order("sort_order", { ascending: true });

      setProfile(profileData);
      setAnalysis(analysisData);
      setJourney(journeyData || []);
      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  const startDate = useMemo(() => {
    if (!profile?.started_at) return "غير محدد";

    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(profile.started_at));
  }, [profile?.started_at]);

  const initials = useMemo(() => {
    const name = profile?.full_name || userEmail || "U";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("");
  }, [profile?.full_name, userEmail]);

  const actions = [
    {
      title: "الدورات المساعدة",
      desc: "دورات مقترحة حسب المواد التي تحتاج تقوية",
      href: "/dashboard/courses",
      icon: BookOpen,
    },
    {
      title: "المساعد الذكي",
      desc: "اسأل عن خطتك وموادك ومستواك الأكاديمي",
      href: "/dashboard/assistant",
      icon: Bot,
    },
    {
      title: "أنشطة تدريبية",
      desc: "تمارين ومهام أسبوعية ترفع مستواك تدريجيًا",
      href: "/dashboard/activities",
      icon: Activity,
    },
    {
      title: "التدقيق الذكي للمستوى",
      desc: "مراجعة دقيقة لتقدمك ونقاط التعثر",
      href: "/dashboard/level-check",
      icon: LineChart,
    },
    {
      title: "التخصص المناسب",
      desc: "تحليل توافقك الأكاديمي مع المسارات المتاحة",
      href: "/dashboard/major-fit",
      icon: Target,
    },
  ];

  if (loading) {
    return (
      <div
        dir="rtl"
        className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#F6F8FB] text-[#172033]"
      >
        <img
          src="/images/athar-background.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-45"
        />

        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

        <div className="relative z-10 flex items-center gap-3 rounded-3xl border border-white/70 bg-white/80 px-6 py-4 text-sm font-bold text-[#667085] shadow-xl backdrop-blur">
          <Loader2 className="h-5 w-5 animate-spin text-[#1E3A8A]" />
          جاري تحميل بياناتك الأكاديمية
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        dir="rtl"
        className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#F6F8FB] px-5"
      >
        <img
          src="/images/athar-background.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-45"
        />

        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-md rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-xl backdrop-blur">
          <UserRound className="mx-auto h-10 w-10 text-[#1E3A8A]" />

          <h1 className="mt-4 text-xl font-black text-[#172033]">
            لم يتم العثور على ملف الطالب
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#667085]">
            الحساب موجود لكن ملف الطالب غير مكتمل
          </p>

          <Link
            href="/signup"
            className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-[#1E3A8A] text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
          >
            إكمال بيانات الطالب
          </Link>
        </div>
      </div>
    );
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
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/brand/athar-logo-color.png"
            alt="أثر AI"
            className="h-22 w-22 object-contain"
          />

          <div>
            
            <div className="text-xs text-[#667085]">
              لوحة الطالب الأكاديمية
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A8A] text-sm font-black text-white">
              {initials}
            </div>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/login");
              }}
              className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-red-500 text-white shadow-lg transition hover:scale-105"
            >
              <LogOut className="h-3 w-3" />
            </button>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-xs font-bold text-[#172033]">
              {profile.full_name}
            </p>

            <p className="text-[11px] text-[#667085]">
              {profile.email}
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EFF6FF] ring-1 ring-[#DBEAFE]">
                  <UserRound className="h-9 w-9 text-[#1E3A8A]" />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#64748B]">
                    مرحبًا بك
                  </p>

                  <h1 className="mt-1 text-2xl font-black text-[#111827] md:text-4xl">
                    {profile.full_name}
                  </h1>

                  <p className="mt-2 text-sm text-[#667085]">
                    @{profile.username} —{" "}
                    {profile.university || "الجامعة غير محددة"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 px-4 py-3">
                <p className="text-xs text-[#64748B]">
                  بداية الرحلة
                </p>

                <p className="mt-1 text-sm font-bold text-[#172033]">
                  {startDate}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <MiniStat
                title="المرحلة الحالية"
                value={profile.level || "غير محدد"}
              />

              <MiniStat
                title="المعدل الحالي"
                value={profile.gpa || "غير محدد"}
              />

              <MiniStat
                title="حالة المستوى"
                value={analysis?.status || "بانتظار التحليل"}
              />

              <MiniStat
                title="هدف الترم"
                value={profile.goal || "لم يحدد بعد"}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#1D4ED8]" />

              <h2 className="text-lg font-black text-[#172033]">
                ملخصك الأكاديمي
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-[#5B6472]">
              هذه البيانات مأخوذة من قاعدة البيانات بناءً على حسابك الحالي وسيتم لاحقًا ربطها بموديل الذكاء الاصطناعي لإنتاج تحليل أعمق ومخصص
            </p>

            <div className="mt-5 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 p-4">
              <p className="text-xs text-[#64748B]">
                هدفك الحالي
              </p>

              <p className="mt-2 text-sm font-bold leading-relaxed text-[#172033]">
                {profile.goal || "لم يتم تحديد هدف أكاديمي بعد"}
              </p>
            </div>

            <Link
              href="/dashboard/next-semester"
              className="mt-5 flex h-12 items-center justify-center rounded-2xl bg-[#1E3A8A] text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8]"
            >
              اقتراح مواد الترم القادم
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,30,58,0.10)] backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-2">
            <Map className="h-5 w-5 text-[#1D4ED8]" />

            <h2 className="text-lg font-black text-[#172033]">
              رحلتك الأكاديمية
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[#E5EAF1] bg-[#F8FAFC]/90 p-5">
            <div className="absolute right-8 top-10 h-[calc(100%-5rem)] w-1 rounded-full bg-[#D7DEE8] md:right-1/2 md:top-1/2 md:h-1 md:w-[80%] md:-translate-y-1/2 md:translate-x-1/2" />

            <div className="relative grid gap-8 md:grid-cols-5">
              {(journey.length ? journey : defaultJourney).map((item) => (
                <div
                  key={item.title}
                  className="relative flex flex-col items-center text-center"
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full border text-sm font-black transition ${
                      item.active
                        ? "border-[#93C5FD] bg-[#1E3A8A] text-white shadow-lg shadow-blue-900/20"
                        : "border-[#D7DEE8] bg-white text-[#64748B]"
                    }`}
                  >
                    {item.sort_order}
                  </div>

                  <h3 className="mt-4 text-sm font-black text-[#172033]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#667085]">
                    {item.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnalysisCard
            title="نقاط القوة"
            items={analysis?.strengths || []}
            icon={<Zap className="h-5 w-5 text-[#F59E0B]" />}
          />

          <AnalysisCard
            title="نقاط تحتاج تطوير"
            items={analysis?.weaknesses || []}
            icon={<Target className="h-5 w-5 text-[#EF4444]" />}
          />

          <AnalysisCard
            title="توصيات الترم"
            items={analysis?.recommended_subjects || []}
            icon={<CalendarDays className="h-5 w-5 text-[#10B981]" />}
          />
        </section>

        <section className="mt-6">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-[#172033]">
              أدوات أثر AI
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              أدوات ذكية تساعدك خلال رحلتك الجامعية
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-3xl border border-white/70 bg-white/82 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#BFDBFE] hover:bg-white"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF6FF] ring-1 ring-[#DBEAFE] transition group-hover:bg-[#1E3A8A]">
                    <Icon className="h-5 w-5 text-[#1E3A8A] group-hover:text-white" />
                  </div>

                  <h3 className="text-lg font-black text-[#172033]">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[#667085]">
                    {action.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function MiniStat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/90 p-4">
      <p className="text-xs text-[#64748B]">
        {title}
      </p>

      <p className="mt-2 text-sm font-black leading-relaxed text-[#172033]">
        {value}
      </p>
    </div>
  );
}

function AnalysisCard({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-xl backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2">
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