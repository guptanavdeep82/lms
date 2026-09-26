"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Bot, LayoutGrid, MessageCircle, Send, User, X } from "lucide-react";
import {
  askChatbot,
  readStoredConversationId,
  readStoredLead,
  storeConversationId,
  storeLead,
  type ChatbotHistoryItem,
  type ChatbotLead,
} from "@/lib/chatbot";
import "./public-chat-widget.css";

type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME =
  "Hi! I am the KR Logics assistant. Ask me about our courses, mock tests, admissions, or contact details. I only answer questions related to this website.";

const VISITOR_KEY_STORAGE = "kr_chatbot_visitor_key";

function resizeTextarea(node: HTMLTextAreaElement | null) {
  if (!node) return;
  node.style.height = "auto";
  node.style.height = `${Math.min(node.scrollHeight, 120)}px`;
}

function getOrCreateVisitorKey(): string {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(VISITOR_KEY_STORAGE);
  if (existing) return existing;
  const key =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(VISITOR_KEY_STORAGE, key);
  return key;
}

export function PublicChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lead, setLead] = useState<ChatbotLead | null>(null);
  const [leadName, setLeadName] = useState("");
  const [leadMobile, setLeadMobile] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedLead = readStoredLead();
    const storedConversationId = readStoredConversationId();
    if (storedLead) {
      setLead(storedLead);
      setLeadName(storedLead.name);
      setLeadMobile(storedLead.mobile);
    }
    if (storedConversationId) {
      setConversationId(storedConversationId);
    }
    setReady(true);
  }, []);

  const needsLeadForm = ready && !conversationId && !lead;

  useEffect(() => {
    if (!open) return;
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, open, loading, needsLeadForm]);

  useEffect(() => {
    if (!open || !ready) return;
    const timer = window.setTimeout(() => {
      if (needsLeadForm) {
        nameRef.current?.focus();
      } else {
        inputRef.current?.focus();
        resizeTextarea(inputRef.current);
      }
    }, 80);
    return () => window.clearTimeout(timer);
  }, [open, ready, needsLeadForm]);

  useEffect(() => {
    resizeTextarea(inputRef.current);
  }, [input]);

  function startChat(event: FormEvent) {
    event.preventDefault();
    const name = leadName.trim();
    const mobile = leadMobile.trim().replace(/\s+/g, "");
    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10)) && !/^\+?\d{10,15}$/.test(mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }
    const normalizedMobile = mobile.replace(/\D/g, "").slice(-10) || mobile;
    const nextLead = { name, mobile: normalizedMobile };
    storeLead(nextLead);
    setLead(nextLead);
    setError(null);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    if (!conversationId && !lead) return;

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
      const result = await askChatbot(text, {
        history,
        studentName: lead?.name,
        studentMobile: lead?.mobile,
        conversationId,
        visitorKey: getOrCreateVisitorKey(),
      });
      storeConversationId(result.conversationId);
      setConversationId(result.conversationId);
      setMessages((current) => [
        ...current,
        { id: `a-${Date.now()}`, role: "assistant", content: result.reply },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to get a reply right now.");
    } finally {
      setLoading(false);
      window.setTimeout(() => {
        inputRef.current?.focus();
        resizeTextarea(inputRef.current);
      }, 40);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className="kr-chat-root">
      {open ? (
        <section className="kr-chat-panel" aria-label="KR Logics AI assistant">
          <div className="kr-chat-header">
            <div className="kr-chat-logo" aria-hidden>
              <LayoutGrid className="h-4 w-4" strokeWidth={2.4} />
            </div>
            <div className="kr-chat-header-text">
              <strong>KR Logics</strong>
              <span>Your AI assistant</span>
            </div>
            <button
              type="button"
              className="kr-chat-header-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          {needsLeadForm ? (
            <div className="kr-chat-lead">
              <p className="kr-chat-lead-copy">
                Please share your name and mobile so we can help you better. Then start chatting.
              </p>
              <form className="kr-chat-lead-form" onSubmit={startChat}>
                <label className="kr-chat-lead-field">
                  <span>Name</span>
                  <input
                    ref={nameRef}
                    type="text"
                    value={leadName}
                    onChange={(event) => setLeadName(event.target.value)}
                    maxLength={120}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="kr-chat-lead-field">
                  <span>Mobile</span>
                  <input
                    type="tel"
                    value={leadMobile}
                    onChange={(event) => setLeadMobile(event.target.value)}
                    maxLength={20}
                    placeholder="10-digit mobile"
                    autoComplete="tel"
                    required
                  />
                </label>
                {error ? <p className="kr-chat-error inline">{error}</p> : null}
                <button type="submit" className="kr-chat-lead-submit">
                  Start chat
                </button>
              </form>
            </div>
          ) : (
            <>
              <div ref={listRef} className="kr-chat-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`kr-chat-row ${message.role === "user" ? "is-user" : "is-assistant"}`}
                  >
                    <div
                      className={`kr-chat-avatar ${message.role === "user" ? "is-user" : "is-bot"}`}
                      aria-hidden
                    >
                      {message.role === "user" ? (
                        <User className="h-3.5 w-3.5" strokeWidth={2.4} />
                      ) : (
                        <Bot className="h-3.5 w-3.5" strokeWidth={2.4} />
                      )}
                    </div>
                    <div className={`kr-chat-bubble ${message.role === "user" ? "is-user" : "is-assistant"}`}>
                      {message.content}
                    </div>
                  </div>
                ))}

                {loading ? (
                  <div className="kr-chat-row is-assistant">
                    <div className="kr-chat-avatar is-bot" aria-hidden>
                      <Bot className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </div>
                    <div className="kr-chat-typing" aria-label="Assistant is typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                ) : null}
              </div>

              {error ? <p className="kr-chat-error">{error}</p> : null}

              <div className="kr-chat-footer">
                <form className="kr-chat-form" onSubmit={onSubmit}>
                  <textarea
                    ref={inputRef}
                    className="kr-chat-input"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Type a message..."
                    maxLength={1000}
                    rows={1}
                    disabled={loading}
                    aria-label="Chat message"
                  />
                  <button
                    type="submit"
                    className="kr-chat-send"
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" strokeWidth={2.4} />
                  </button>
                </form>
                <p className="kr-chat-powered">
                  Powered by <strong>KR Logics</strong>
                </p>
              </div>
            </>
          )}
        </section>
      ) : null}

      <button
        type="button"
        className="kr-chat-fab"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open KR Logics assistant"}
      >
        {open ? (
          <X className="h-6 w-6" strokeWidth={2.5} />
        ) : (
          <MessageCircle className="h-6 w-6" strokeWidth={2.25} />
        )}
      </button>
    </div>
  );
}
