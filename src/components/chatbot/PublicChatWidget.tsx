"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { askChatbot, type ChatbotHistoryItem } from "@/lib/chatbot";

type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME =
  "Hi! I am the KR Logics assistant. Ask me about our courses, mock tests, admissions, or contact details. I only answer questions related to this website.";

export function PublicChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: UiMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    const history: ChatbotHistoryItem[] = nextMessages
      .filter((item) => item.id !== "welcome")
      .slice(0, -1)
      .map((item) => ({ role: item.role, content: item.content }));

    try {
      const reply = await askChatbot(text, history);
      setMessages((current) => [
        ...current,
        { id: `a-${Date.now()}`, role: "assistant", content: reply },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to get a reply right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-[80] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <section
          className="flex h-[min(540px,calc(100vh-120px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-[#dbe4f5] bg-white shadow-[0_20px_60px_rgba(14,49,141,0.22)]"
          aria-label="KR Logics AI assistant"
        >
          <header className="relative flex items-center gap-3 bg-gradient-to-br from-[#0957D3] to-[#0538A1] px-4 py-3.5 text-white">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
              <Bot className="h-5 w-5" strokeWidth={2.25} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-[15px] font-bold tracking-tight">
                KR Logics Assistant
              </strong>
              <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/80">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#fbbf24]" aria-hidden />
                Online · Website help
              </span>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#f5f8fc] px-3.5 py-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex max-w-[86%] ${
                  message.role === "user" ? "self-end" : "self-start"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0957D3]/10 text-[#0957D3]">
                    <Bot className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
                  </div>
                ) : null}
                <div
                  className={`whitespace-pre-wrap break-words px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    message.role === "user"
                      ? "rounded-2xl rounded-br-md bg-[#0957D3] text-white shadow-sm"
                      : "rounded-2xl rounded-bl-md border border-[#dbe4f5] bg-white text-[#1e1b3a] shadow-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex self-start">
                <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0957D3]/10 text-[#0957D3]">
                  <Bot className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#dbe4f5] bg-white px-4 py-3 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#64748b] [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#64748b] [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#64748b] [animation-delay:300ms]" />
                </div>
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="m-0 border-t border-red-100 bg-red-50 px-3.5 py-2 text-xs font-semibold text-[#b91c1c]">
              {error}
            </p>
          ) : null}

          <form
            className="flex items-end gap-2 border-t border-[#dbe4f5] bg-white p-3"
            onSubmit={onSubmit}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about courses, mocks…"
              maxLength={1000}
              disabled={loading}
              aria-label="Chat message"
              className="min-w-0 flex-1 rounded-xl border border-[#dbe4f5] bg-[#f5f8fc] px-3.5 py-2.5 text-[13px] text-[#1e1b3a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#0957D3] focus:bg-white focus:ring-2 focus:ring-[#0957D3]/15 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f59e0b] text-[#0538A1] transition hover:bg-[#fbbf24] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Send className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border-0 bg-gradient-to-br from-[#0957D3] to-[#0538A1] text-white shadow-[0_10px_28px_rgba(5,56,161,0.4)] transition hover:scale-105 hover:shadow-[0_14px_32px_rgba(5,56,161,0.48)] active:scale-95"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open KR Logics assistant"}
      >
        <span className="absolute inset-0 rounded-full bg-[#fbbf24]/0 transition group-hover:bg-[#fbbf24]/10" aria-hidden />
        {open ? (
          <X className="relative h-6 w-6" strokeWidth={2.5} />
        ) : (
          <MessageCircle className="relative h-6 w-6" strokeWidth={2.25} fill="currentColor" fillOpacity={0.15} />
        )}
      </button>
    </div>
  );
}
