"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowRight,
  Bot,
  Loader2,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "أهلًا بك في مساعد أثر AI الأكاديمي\nاسأل عن المواد أو المعدل أو تنظيم الدراسة أو التخصص",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState("الطالب");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const email = session?.user?.email;

      if (!email) return;

      const { data } = await supabase
        .from("student_profiles")
        .select("full_name")
        .eq("email", email)
        .single();

      if (data?.full_name) {
        setStudentName(data.full_name);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      });

      const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || "فشل الاتصال بالمساعد");
}

const assistantMessage: Message = {
  role: "assistant",
  content: data.reply || "تعذر إنشاء الرد الحالي",
};

setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: error?.message || "حدث خطأ أثناء التواصل مع المساعد",
    },
  ]);
}

    setLoading(false);
  }

  return (
    <div
      dir="rtl"
      className="relative min-h-dvh overflow-hidden bg-[#172554] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(37,99,235,0.35),transparent_55%),radial-gradient(ellipse_at_85%_20%,rgba(16,185,129,0.14),transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.08),transparent_45%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-10">
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
            <div className="text-xs text-white/60">
              المساعد الأكاديمي الذكي
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col px-5 pb-10 md:px-10">
        <section className="rounded-3xl border border-white/10 bg-white/8 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="flex items-center gap-4 border-b border-white/10 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563EB]">
              <Bot className="h-7 w-7" />
            </div>

            <div>
              <h1 className="text-xl font-black">
                أهلًا {studentName}
              </h1>

              <p className="mt-1 text-sm text-white/60">
                المساعد يفهم بياناتك الأكاديمية الحالية
              </p>
            </div>
          </div>

          <div className="h-[65vh] overflow-y-auto p-5">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl border px-5 py-4 text-sm leading-loose ${
                      message.role === "user"
                        ? "border-[#60A5FA]/30 bg-[#2563EB]/50 text-white"
                        : "border-white/10 bg-white/10 text-white/80"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-end">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/70">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري التفكير
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-white/10 p-5">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="اسأل عن الدراسة أو المعدل أو المواد"
                className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#60A5FA]"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] transition hover:bg-[#1D4ED8] disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}