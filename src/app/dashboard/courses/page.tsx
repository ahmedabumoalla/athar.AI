"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  PlayCircle,
  Search,
  Sparkles,
  Star,
  Target,
  ChevronRight
} from "lucide-react";

type StudentPayload = {
  studentId: string;
  createdAt: string;
  profile: {
    fullName: string;
    username: string;
    major: string;
    level: string;
    gpa: string;
    weakSubjects: string;
    strongSubjects: string;
    goal: string;
    studyHours: string;
    learningStyle: string;
  };
  academicAnalysis: {
    status: string;
    strengths: string[];
    weaknesses: string[];
    recommendedSubjects: string[];
    recommendedCourses: string[];
    exercises: string[];
  };
};

const demoData: StudentPayload = {
  studentId: "athar_demo_student_2026",
  createdAt: new Date().toISOString(),
  profile: {
    fullName: "عبدالله أحمد",
    username: "abdullah_2026",
    major: "الهندسة الميكانيكية",
    level: "المستوى الخامس",
    gpa: "3.42 من 5",
    weakSubjects: "الرياضيات الهندسية، الديناميكا، الإحصاء",
    strongSubjects: "التصميم الهندسي، الرسم الهندسي، إدارة المشاريع",
    goal: "رفع المعدل وتحسين الفهم في المواد التحليلية",
    studyHours: "6 إلى 8 ساعات أسبوعيًا",
    learningStyle: "أتعلم أفضل بالتطبيق العملي وحل التمارين",
  },
  academicAnalysis: {
    status: "متوسط مع قابلية عالية للتحسن",
    strengths: [
      "قدرة جيدة في المواد التطبيقية والتصميمية",
      "هدف أكاديمي واضح لهذا الترم",
      "أسلوب تعلم عملي مناسب للتطور السريع",
    ],
    weaknesses: [
      "يحتاج إلى تقوية الأساس الرياضي والتحليلي",
      "يحتاج إلى تنظيم ساعات المذاكرة أسبوعيًا",
      "المواد النظرية تحتاج متابعة قبل تراكمها",
    ],
    recommendedSubjects: [
      "الرياضيات الهندسية",
      "الإحصاء التطبيقي",
      "الديناميكا",
      "مهارات التعلم الجامعي",
    ],
    recommendedCourses: [
      "أساسيات التفاضل والتكامل",
      "التحليل الإحصائي للطلاب",
      "إدارة الوقت والمذاكرة الفعالة",
      "حل المسائل الهندسية خطوة بخطوة",
    ],
    exercises: [
      "حل 15 مسألة رياضية أسبوعيًا",
      "تلخيص كل محاضرة في صفحة واحدة",
      "اختبار قصير نهاية كل أسبوع",
      "جلسة مراجعة عملية للمواد الصعبة",
    ],
  },
};

const courses = [
  {
    title: "أساسيات التفاضل والتكامل",
    category: "مواد تحليلية",
    level: "مبتدئ",
    duration: "4 أسابيع",
    match: 96,
    reason: "مناسب لتقوية أساس الرياضيات الهندسية.",
    skills: ["الدوال", "المشتقات", "التكامل", "حل المسائل"],
    externalUrl: "https://www.khanacademy.org/math/calculus-1",
  },
  {
    title: "التفاضل والتكامل بالعربي",
    category: "مواد تحليلية",
    level: "مبتدئ",
    duration: "3 أسابيع",
    match: 94,
    reason: "شرح عربي مبسط للتفاضل والتكامل.",
    skills: ["Limits", "Derivatives", "Integration", "Math Basics"],
    externalUrl:
      "https://www.youtube.com/playlist?list=PLlxkB5rX3SJl0JyV3JCgBZUUfEls3H2jN",
  },
  {
    title: "Engineering Mathematics",
    category: "مواد تخصصية",
    level: "متوسط",
    duration: "5 أسابيع",
    match: 91,
    reason: "مفيد لطلاب الهندسة في الرياضيات التطبيقية.",
    skills: ["Linear Algebra", "Calculus", "Differential Equations"],
    externalUrl:
      "https://www.youtube.com/playlist?list=PLvTTv60o7qj_tdY9zH7YceES7jfXiZkAz",
  },
  {
    title: "الإحصاء التطبيقي بالعربي",
    category: "مواد تحليلية",
    level: "مبتدئ",
    duration: "3 أسابيع",
    match: 89,
    reason: "يعالج ضعف الإحصاء ويربطه بالتطبيقات الجامعية.",
    skills: ["المتوسطات", "الاحتمالات", "قراءة البيانات", "التحليل"],
    externalUrl:
      "https://www.youtube.com/playlist?list=PL2LRRctxxQrvQY51KZiQIdJWY67HsANdW",
  },
  {
    title: "Data Analysis in Arabic",
    category: "تطبيق عملي",
    level: "متوسط",
    duration: "4 أسابيع",
    match: 84,
    reason: "يقوي مهارة التحليل والتعامل مع البيانات.",
    skills: ["Pandas", "Data Cleaning", "Statistics", "Visualization"],
    externalUrl:
      "https://www.youtube.com/playlist?list=PLLNcX0YCuT076oWMhmvDa4U_Qh0q64nzu",
  },
  {
    title: "Precalculus",
    category: "مواد تحليلية",
    level: "مبتدئ",
    duration: "4 أسابيع",
    match: 82,
    reason: "مناسب لتأسيس الطالب قبل المواد الرياضية المتقدمة.",
    skills: ["Functions", "Trigonometry", "Vectors", "Matrices"],
    externalUrl: "https://www.khanacademy.org/math/precalculus",
  },
];

const categories = [
  "الكل",
  "مواد تحليلية",
  "مواد تخصصية",
  "مهارات دراسية",
  "تطبيق عملي",
];

export default function CoursesPage() {
  const [data, setData] = useState<StudentPayload>(demoData);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("athar_ai_current_user");

    if (!currentUser) return;

    const stored = localStorage.getItem(`athar_ai_user_${currentUser}`);

    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === "الكل" || course.category === selectedCategory;

      const matchesSearch =
        course.title.includes(search) ||
        course.category.includes(search) ||
        course.skills.join(" ").includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 pb-16"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">أثر AI</div>
              <div className="text-[10px] font-medium text-slate-500">
                الدورات المساعدة
              </div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-600"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="hidden sm:inline">الرجوع للوحة القيادة</span>
            <span className="sm:hidden">الرجوع</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-7xl px-5 md:px-8 space-y-6">
        {/* Top Section */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 flex flex-col justify-center">
            <div className="absolute top-0 right-0 h-full w-2 bg-blue-600"></div>
            
            <div className="mb-4 inline-flex items-center gap-2 w-max rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Sparkles className="h-3 w-3" />
              توصيات مبنية على تحليل الذكاء الاصطناعي
            </div>

            <h1 className="max-w-2xl text-2xl font-bold leading-snug text-slate-900 md:text-3xl lg:text-4xl">
              دورات مقترحة صُممت خصيصاً لرفع مستواك الأكاديمي
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500">
              استناداً إلى نقاط ضعفك وأهدافك الحالية التي تم تحليلها، إليك مجموعة
              من الكورسات والمواد الإثرائية التي ستسد الفجوات المعرفية لديك.
            </p>
          </div>

          {/* Analysis Summary */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">ملخص التحليل</h2>
                <p className="text-xs text-slate-500 mt-1">الأساس الذي بنيت عليه التوصيات</p>
              </div>
            </div>

            <div className="space-y-3 flex-1 flex flex-col justify-center">
              <InfoLine title="مواد تحتاج دعم" value={data.profile.weakSubjects} />
              <InfoLine title="هدفك الحالي" value={data.profile.goal} />
              <InfoLine title="أسلوب التعلم" value={data.profile.learningStyle} />
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md group">
              <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن دورة أو مهارة..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-11 pl-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg border px-4 py-2.5 text-xs font-semibold transition-all ${
                    selectedCategory === category
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.title}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <div>
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      <Target className="h-3 w-3" />
                      تطابق {course.match}%
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
                    {course.reason}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Badge icon={<GraduationCap className="h-3.5 w-3.5" />} text={course.level} />
                    <Badge icon={<Clock3 className="h-3.5 w-3.5" />} text={course.duration} />
                    <Badge icon={<CalendarDays className="h-3.5 w-3.5" />} text={course.category} />
                    <Badge icon={<Star className="h-3.5 w-3.5 text-amber-500" />} text="مقترحة لك" />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {course.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={course.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  <PlayCircle className="h-4 w-4" />
                  ابدأ الدورة الآن
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-500">
              <Search className="mx-auto mb-4 h-8 w-8 text-slate-300" />
              <p>لم يتم العثور على دورات تطابق بحثك.</p>
            </div>
          )}
        </section>

        {/* Weekly Plan Action Section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                خطة الإنجاز المقترحة لهذا الأسبوع
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                مهام صغيرة ومستمرة تصنع الفارق الأكبر
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.academicAnalysis.exercises.map((item, i) => (
              <div
                key={item}
                className="group relative flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-white hover:shadow-sm"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-100">
                  {i + 1}
                </span>
                <p className="text-sm font-medium leading-relaxed text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoLine({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50 p-3.5">
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-bold text-slate-900 leading-snug">
        {value}
      </p>
    </div>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600">
      <span className="text-slate-400">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}