import Link from "next/link";

export default function LandingPage() {
  return (
    <div
      dir="rtl"
      className="relative min-h-dvh overflow-hidden bg-[#F6F8FB] text-[#172033]"
    >
      <img
        src="/images/athar-background.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-white/55" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.55),transparent_52%),radial-gradient(ellipse_at_50%_100%,rgba(37,99,235,0.08),transparent_45%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-10">
        <div className="flex items-center gap-3">
          <img
            src="/brand/athar-logo-color.png"
            className="h-40 w-auto object-contain"
          />

          
        </div>

        <Link
          href="/login"
          className="rounded-2xl border border-[#D7DEE8] bg-white/80 px-5 py-2.5 text-sm font-bold text-[#1E3A8A] shadow-sm backdrop-blur transition hover:border-[#93C5FD] hover:bg-white"
        >
          تسجيل الدخول
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100dvh-140px)] max-w-6xl flex-col items-center justify-center px-5 pb-24 pt-6 text-center md:px-10">
        <p className="mb-4 inline-flex rounded-full border border-[#BFDBFE] bg-[#EFF6FF]/90 px-4 py-1.5 text-xs font-semibold text-[#1D4ED8] shadow-sm backdrop-blur">
          إرشاد أكاديمي — تحليل أداء — خطة تقدم
        </p>

        <h1 className="max-w-3xl text-3xl font-black leading-snug tracking-tight text-[#111827] md:text-5xl md:leading-tight">
          رحلتك الجامعية تبدأ بقراءة ذكية لملفك… ثم خطوات واثقة
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#5B6472] md:text-base">
          تشخيص دقيق، تحليل يفهم مستواك الأكاديمي، وتوصيات تساعدك على تحسين
          أدائك الدراسي واتخاذ قرارات أكاديمية أوضح
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="flex h-12 min-w-[200px] items-center justify-center rounded-2xl bg-[#1E3A8A] px-8 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8]"
          >
            ابدأ الآن
          </Link>

          <Link
            href="/login"
            className="flex h-12 min-w-[160px] items-center justify-center rounded-2xl border border-[#D7DEE8] bg-white/80 px-8 text-sm font-bold text-[#1E3A8A] shadow-sm backdrop-blur transition hover:bg-white"
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[#E5EAF1] bg-white/40 py-6 text-center text-xs text-[#667085] backdrop-blur">
        © {new Date().getFullYear()} أثر AI — منصة إرشاد أكاديمي ذكية
      </footer>
    </div>
  );
}