"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowRight,
  Bot,
  Loader2,
  Send,
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
      className="relative min-h-dvh overflow-hidden bg-[#F6F8FB] text-[#172033]"
    >
      <img
        src="/images/athar-background.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-45"
      />

      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.65),transparent_52%),radial-gradient(ellipse_at_50%_100%,rgba(37,99,235,0.08),transparent_45%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-10">
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
            className="h-12 w-auto object-contain"
          />

          <div>
            
            <div className="text-xs text-[#667085]">
              المساعد الأكاديمي الذكي
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col px-5 pb-10 md:px-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 shadow-[0_24px_80px_rgba(15,30,58,0.12)] backdrop-blur-xl">
          <div className="flex items-center gap-4 border-b border-[#E5EAF1] bg-white/60 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] ring-1 ring-[#DBEAFE]">
              <Bot className="h-7 w-7 text-[#1E3A8A]" />
            </div>

            <div>
              <h1 className="text-xl font-black text-[#111827]">
                أهلًا {studentName}
              </h1>

              <p className="mt-1 text-sm text-[#667085]">
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
                    className={`max-w-[85%] rounded-3xl border px-5 py-4 text-sm leading-loose shadow-sm ${
                      message.role === "user"
                        ? "border-[#93C5FD] bg-[#1E3A8A] text-white"
                        : "border-[#E5EAF1] bg-[#F8FAFC]/95 text-[#4B5563]"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-end">
                  <div className="flex items-center gap-2 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC]/95 px-4 py-3 text-sm text-[#667085]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#1E3A8A]" />
                    جاري التفكير
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-[#E5EAF1] bg-white/60 p-5">
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
                className="h-12 flex-1 rounded-2xl border border-[#D7DEE8] bg-white/80 px-4 text-sm text-[#172033] shadow-sm outline-none placeholder:text-[#94A3B8] transition focus:border-[#93C5FD] focus:bg-white"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E3A8A] text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#1D4ED8] disabled:opacity-50"
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