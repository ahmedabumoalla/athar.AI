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
  Sparkles,
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
        className="flex min-h-dvh items-center justify-center bg-[#172554] text-white"
      >
        <div className="flex items-center gap-3 text-sm font-bold text-white/70">
          <Loader2 className="h-5 w-5 animate-spin" />
          جاري التحقق من الجلسة
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="relative min-h-dvh overflow-hidden bg-[#172554] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(37,99,235,0.35),transparent_55%),radial-gradient(ellipse_at_85%_20%,rgba(16,185,129,0.14),transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.08),transparent_45%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
        >
          <ArrowRight className="h-4 w-4" />
          الرئيسية
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#172554] shadow-lg shadow-black/20 ring-1 ring-white/10">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <div className="text-sm font-extrabold">أثر AI</div>
            <div className="text-xs text-white/60">تسجيل الدخول</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100dvh-100px)] max-w-6xl items-center gap-8 px-5 pb-16 md:grid-cols-[0.95fr_1.05fr] md:px-10">
        <section className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
            دخول الطالب
          </p>

          <h1 className="text-3xl font-black leading-snug md:text-5xl md:leading-tight">
            أهلاً بعودتك إلى أثر AI
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-white/70">
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
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {message}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white shadow-lg shadow-black/25 transition hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "جاري تسجيل الدخول" : "تسجيل الدخول"}
            </button>

            <Link
              href="/signup"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </section>

        <section className="hidden md:block">
          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/10">
              <GraduationCap className="h-8 w-8 text-[#93C5FD]" />
            </div>

            <h2 className="mt-6 text-2xl font-black">
              لوحة أكاديمية مرتبطة ببياناتك
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/65">
              بعد تسجيل الدخول يتم جلب بياناتك من قاعدة البيانات مباشرة وعرض التحليل والخطة والأنشطة المرتبطة بحسابك
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
      <span className="mb-2 block text-xs font-bold text-white/70">
        {label}
      </span>

      <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 text-white transition focus-within:border-[#60A5FA] focus-within:bg-white/15">
        <div className="text-white/45">{icon}</div>

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
          className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
        />
      </div>
    </label>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
      {text}
    </div>
  );
}