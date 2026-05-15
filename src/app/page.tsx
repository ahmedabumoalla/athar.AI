import Link from "next/link";

export default function LandingPage() {
  return (
    <div
      dir="rtl"
      className="relative min-h-dvh overflow-hidden bg-[#F6F8FB] text-[#172033]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(37,99,235,0.12),transparent_55%),radial-gradient(ellipse_at_80%_30%,rgba(20,184,166,0.10),transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(245,158,11,0.08),transparent_45%)]" />

      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#DBEAFE] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#CCFBF1] blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-48 w-48 rotate-12 rounded-3xl border border-[#D7DEE8] bg-white/45" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-32 w-32 -rotate-6 rounded-full border border-[#D7DEE8] bg-white/45" />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-5 py-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] shadow-lg shadow-blue-900/15 ring-1 ring-white" />

          <div>
            <div className="text-sm font-extrabold tracking-tight text-[#172033]">
              أثر AI
            </div>

            <div className="text-xs text-[#667085]">
              مسارك الأكاديمي… أوضح
            </div>
          </div>
        </div>

        <Link
          href="/login"
          className="rounded-xl border border-[#D7DEE8] bg-white px-5 py-2 text-sm font-bold text-[#1E3A8A] shadow-sm transition hover:border-[#93C5FD] hover:bg-[#EFF6FF]"
        >
          تسجيل الدخول
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pb-24 pt-6 text-center md:px-10 md:pb-32 md:pt-12">
        <p className="mb-4 inline-flex rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-1.5 text-xs font-semibold text-[#1D4ED8] backdrop-blur">
          إرشاد أكاديمي — تحليل أداء — خطة تقدم
        </p>

        <h1 className="max-w-3xl text-3xl font-black leading-snug tracking-tight text-[#111827] md:text-5xl md:leading-tight">
          رحلتك الجامعية تبدأ بقراءة ذكية لملفك… ثم خطوات واثقة
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#5B6472] md:text-base">
          تشخيص دقيق، تحليل يفهم مستواك الأكاديمي، وتوصيات تساعدك على تحسين
          أدائك الدراسي واتخاذ قرارات أكاديمية أوضح.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="flex h-12 min-w-[200px] items-center justify-center rounded-xl bg-[#1E3A8A] px-8 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8]"
          >
            ابدأ الآن
          </Link>

          <Link
            href="/login"
            className="text-sm font-semibold text-[#1E3A8A] underline-offset-4 transition hover:text-[#1D4ED8] hover:underline"
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[#E5EAF1] bg-white/40 py-6 text-center text-xs text-[#667085]">
        © {new Date().getFullYear()} أثر AI — منصة إرشاد أكاديمي ذكية.
      </footer>
    </div>
  );
}