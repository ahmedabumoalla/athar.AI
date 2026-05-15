import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, GraduationCap } from "lucide-react";

export default function HomePage() {
  return (
    <main dir="rtl" className="min-h-dvh overflow-hidden bg-[#F7F3EA] text-[#17211D]">
      <section className="relative min-h-dvh px-6 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(210,181,98,0.25),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(54,94,74,0.18),transparent_34%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#17211D] text-xl font-black text-white">
              م
            </div>
            <span className="text-lg font-black">منصة مرن</span>
          </div>

          <Link
            href="/login"
            className="rounded-full border border-[#17211D]/10 bg-white/70 px-6 py-3 text-sm font-bold shadow-sm backdrop-blur transition hover:bg-white"
          >
            تسجيل الدخول
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-92px)] max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D2B562]/30 bg-white/60 px-4 py-2 text-sm font-bold text-[#8B6D20] shadow-sm backdrop-blur">
              <GraduationCap size={18} />
              من الجامعة إلى سوق العمل
            </div>

            <h1 className="text-5xl font-black leading-[1.12] tracking-tight md:text-7xl">
              طريقك المهني
              <span className="block text-[#9B7627]">يبدأ بخطوة مرنة</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-9 text-[#5D675F]">
              منصة تساعد الطالب على بناء خبرته واكتشاف فرصته المناسبة بثقة.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-3 rounded-full bg-[#17211D] px-8 py-4 text-base font-black text-white shadow-[0_18px_40px_rgba(23,33,29,0.22)] transition hover:-translate-y-1"
              >
                انطلق الآن
                <ArrowLeft className="transition group-hover:-translate-x-1" size={20} />
              </Link>

              <Link
                href="/register"
                className="rounded-full border border-[#17211D]/10 bg-white/75 px-8 py-4 text-base font-black text-[#17211D] shadow-sm backdrop-blur transition hover:-translate-y-1 hover:bg-white"
              >
                تسجيل حساب جديد
              </Link>
            </div>
          </div>

          <div className="relative hidden h-[560px] lg:block">
            <div className="absolute inset-x-8 bottom-0 h-28 rounded-[100%] bg-[#17211D]/10 blur-2xl" />

            <div className="absolute right-10 top-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-xl">
              <GraduationCap size={42} className="text-[#17211D]" />
            </div>

            <div className="absolute left-16 top-4 flex h-28 w-28 items-center justify-center rounded-[2.2rem] bg-[#17211D] shadow-2xl">
              <BriefcaseBusiness size={46} className="text-white" />
            </div>

            <svg viewBox="0 0 620 560" className="absolute inset-0 h-full w-full">
              <path
                d="M480 520 C400 430 365 350 335 270 C305 190 250 125 145 70"
                fill="none"
                stroke="#17211D"
                strokeWidth="58"
                strokeLinecap="round"
              />
              <path
                d="M480 520 C400 430 365 350 335 270 C305 190 250 125 145 70"
                fill="none"
                stroke="#F7F3EA"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="24 24"
              />

              <circle cx="480" cy="520" r="18" fill="#D2B562" />
              <circle cx="335" cy="270" r="16" fill="#D2B562" />
              <circle cx="145" cy="70" r="18" fill="#D2B562" />
            </svg>

            <div className="absolute bottom-10 right-6 rounded-3xl border border-white/70 bg-white/70 p-5 shadow-xl backdrop-blur">
              <p className="text-sm font-black text-[#9B7627]">البداية</p>
              <p className="mt-1 text-lg font-black">طالب جامعي</p>
            </div>

            <div className="absolute left-8 top-40 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur">
              <p className="text-sm font-black text-[#9B7627]">الوجهة</p>
              <p className="mt-1 text-lg font-black">فرصة مهنية</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}