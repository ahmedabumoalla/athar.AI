"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowRight,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        router.replace("/dashboard");
        return;
      }

      setCheckingSession(false);
    }

    checkSession();
  }, [router]);

  async function handleLogin() {
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setMessage("فضلاً أدخل الإيميل وكلمة المرور");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("بيانات الدخول غير صحيحة أو الحساب غير موجود");
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
  }

  if (checkingSession) {
    return (
      <div
        dir="rtl"
        className="flex min-h-dvh items-center justify-center bg-[#F6F8FB] text-[#172033]"
      >
        <div className="flex items-center gap-3 rounded-3xl border border-[#E5EAF1] bg-white/80 px-6 py-4 text-sm font-bold text-[#667085] shadow-xl backdrop-blur">
          <Loader2 className="h-5 w-5 animate-spin text-[#1E3A8A]" />
          جاري التحقق من الجلسة
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
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-white/60" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.55),transparent_52%),radial-gradient(ellipse_at_50%_100%,rgba(37,99,235,0.08),transparent_45%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-2xl border border-[#D7DEE8] bg-white/80 px-4 py-2 text-sm font-bold text-[#1E3A8A] shadow-sm backdrop-blur transition hover:bg-white"
        >
          <ArrowRight className="h-4 w-4" />
          الرئيسية
        </Link>

        <div className="flex items-center gap-3">
          <img
            src="/brand/athar-logo-color.png"
            alt="أثر AI"
            className="h-30 w-auto object-contain"
          />

          
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100dvh-100px)] max-w-6xl items-center gap-8 px-5 pb-16 md:grid-cols-[0.95fr_1.05fr] md:px-10">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-7 shadow-[0_24px_80px_rgba(15,30,58,0.12)] backdrop-blur-xl">
          <p className="mb-4 inline-flex rounded-full border border-[#BFDBFE] bg-[#EFF6FF]/90 px-4 py-1.5 text-xs font-semibold text-[#1D4ED8]">
            دخول الطالب
          </p>

          <h1 className="text-3xl font-black leading-snug text-[#111827] md:text-5xl md:leading-tight">
            أهلاً بعودتك إلى أثر AI
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-[#5B6472]">
            سجّل دخولك لمتابعة ملفك الأكاديمي وتحليلاتك وخطتك القادمة
          </p>

          <div className="mt-8 space-y-4">
            <Input
              label="الإيميل"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="example@email.com"
            />

            <Input
              label="كلمة المرور"
              icon={<LockKeyhole className="h-4 w-4" />}
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="••••••••"
            />

            {message && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {message}
              </div>
            )}

            <button
              data-login-button="true"
              onClick={handleLogin}
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "جاري تسجيل الدخول" : "تسجيل الدخول"}
            </button>

            <Link
              href="/signup"
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-[#D7DEE8] bg-white/80 text-sm font-bold text-[#1E3A8A] shadow-sm transition hover:bg-white"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </section>

        <section className="hidden md:block">
          <div className="rounded-[2rem] border border-white/70 bg-white/75 p-7 shadow-[0_24px_80px_rgba(15,30,58,0.12)] backdrop-blur-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EFF6FF] ring-1 ring-[#DBEAFE]">
              <GraduationCap className="h-8 w-8 text-[#1E3A8A]" />
            </div>

            <h2 className="mt-6 text-2xl font-black text-[#111827]">
              لوحة أكاديمية مرتبطة ببياناتك
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-[#5B6472]">
              بعد تسجيل الدخول يتم جلب بياناتك من قاعدة البيانات مباشرة وعرض
              التحليل والخطة والأنشطة المرتبطة بحسابك
            </p>

            <div className="mt-6 grid gap-3">
              <Feature text="جلسة دخول حقيقية عبر Supabase" />
              <Feature text="بيانات الطالب تظهر حسب الإيميل المسجل" />
              <Feature text="الدورات والأنشطة والتحليلات مرتبطة بحسابك" />
              <Feature text="تسجيل خروج آمن من لوحة الطالب" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Input({
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-[#667085]">
        {label}
      </span>

      <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#D7DEE8] bg-white/80 px-4 text-[#172033] shadow-sm transition focus-within:border-[#93C5FD] focus-within:bg-white">
        <div className="text-[#94A3B8]">{icon}</div>

        <input
          value={value}
          type={type}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const button = document.querySelector<HTMLButtonElement>(
                "button[data-login-button='true']"
              );
              button?.click();
            }
          }}
          className="h-full w-full bg-transparent text-sm text-[#172033] outline-none placeholder:text-[#94A3B8]"
        />
      </div>
    </label>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/80 px-4 py-3 text-sm font-semibold text-[#5B6472]">
      {text}
    </div>
  );
}