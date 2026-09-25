"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
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

  useEffect(() => {
    if (!open) return;
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, open, loading]);

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
    <div className="fixed right-4 bottom-4 z-[80] sm:right-5 sm:bottom-5">
      {open ? (
        <section
          className="mb-3.5 flex h-[min(520px,calc(100vh-110px))] w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-[18px] border border-[#dbe4f5] bg-white shadow-[0_18px_50px_rgba(15,30,74,0.18)]"
          aria-label="KR Logics AI assistant"
        >
          <header className="flex items-center justify-between gap-3 bg-[#0538A1] px-4 py-3.5 text-white">
            <div>
              <strong className="block text-sm font-extrabold">KR Logics Assistant</strong>
              <small className="mt-0.5 block text-[11px] opacity-80">Website help only</small>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-2xl leading-none text-white"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div ref={listRef} className="flex flex-1 flex-col gap-2.5 overflow-auto bg-[#f5f8fc] p-3.5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[88%] whitespace-pre-wrap break-words rounded-[14px] px-3 py-2.5 text-[13px] leading-relaxed ${
                  message.role === "user"
                    ? "self-end rounded-br-sm bg-[#0957D3] text-white"
                    : "self-start rounded-bl-sm border border-[#dbe4f5] bg-white text-[#1e1b3a]"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="max-w-[88%] self-start rounded-[14px] rounded-bl-sm border border-[#dbe4f5] bg-white px-3 py-2.5 text-[13px] italic text-[#64748b]">
                Thinking…
              </div>
            ) : null}
          </div>

          {error ? <p className="m-0 px-3.5 pt-2 text-xs font-semibold text-[#b91c1c]">{error}</p> : null}

          <form className="grid grid-cols-[1fr_auto] gap-2 border-t border-[#dbe4f5] bg-white p-3" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about KR Logics…"
              maxLength={1000}
              disabled={loading}
              aria-label="Chat message"
              className="rounded-[10px] border-[1.5px] border-[#dbe4f5] px-3 py-2.5 text-[13px] outline-none focus:border-[#0957D3]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-[10px] bg-[#f59e0b] px-3.5 font-extrabold text-[#0538A1] disabled:cursor-not-allowed disabled:opacity-55"
            >
              Send
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="h-[58px] w-[58px] rounded-full border-0 bg-gradient-to-br from-[#0957D3] to-[#0538A1] text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(5,56,161,0.35)]"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open KR Logics assistant"}
      >
        {open ? "×" : "Chat"}
      </button>
    </div>
  );
}
