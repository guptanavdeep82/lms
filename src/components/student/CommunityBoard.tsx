"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, Loader2, Mic, Paperclip, Send, Users } from "lucide-react";
import {
  fetchCommunities,
  fetchCommunityMessages,
  sendCommunityMessage,
  type CommunityMessage,
  type CommunitySummary,
} from "@/lib/communities";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "C";
}

function MessageBubble({ message }: { message: CommunityMessage }) {
  return (
    <article className={`max-w-[78%] rounded-xl px-3 py-2 shadow-sm ${message.is_mine ? "self-end bg-[#d9fdd3]" : "self-start bg-white"}`}>
      {!message.is_mine ? (
        <p className="mb-1 flex items-center gap-2 text-xs font-extrabold text-[#0957D3]">
          {message.sender_name}
          {message.sender_type === "admin" ? (
            <span className="rounded-full bg-[#172a69] px-1.5 py-0.5 text-[10px] font-bold text-white">Admin</span>
          ) : null}
        </p>
      ) : null}
      {message.body ? <p className="whitespace-pre-wrap break-words text-[13px] leading-5 text-[#111827]">{message.body}</p> : null}
      {message.attachment?.kind === "image" ? (
        <a href={message.attachment.url} target="_blank" rel="noreferrer">
          {/* User uploads come from the API host, which is not part of the Next image allowlist. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={message.attachment.url} alt={message.attachment.name || "Photo"} className="mt-2 max-h-64 rounded-lg" />
        </a>
      ) : null}
      {message.attachment?.kind === "audio" ? <audio className="mt-2 w-56 max-w-full" controls src={message.attachment.url} /> : null}
      {message.attachment?.kind === "document" ? (
        <a className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#172a69] underline" href={message.attachment.url} target="_blank" rel="noreferrer">
          <FileText size={16} />
          {message.attachment.name || "Document"}
        </a>
      ) : null}
      <time className="mt-1 block text-right text-[11px] text-[#667085]">{message.time_label}</time>
    </article>
  );
}

export function CommunityBoard() {
  const params = useSearchParams();
  const router = useRouter();
  const groupId = Number(params.get("group") || 0);
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setCommunities(await fetchCommunities());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load communities.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!groupId) void loadList();
  }, [groupId, loadList]);

  if (groupId) {
    return <CommunityChat communityId={groupId} onBack={() => router.push("/student/communities")} />;
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#dfe5ef] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="border-b border-[#edf1f7] px-6 py-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7d8799]">Communities</p>
        <h1 className="mt-1 text-2xl font-extrabold text-[#172a69]">Your course groups</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">A group appears here only after you purchase that course.</p>
      </div>
      {loading ? (
        <div className="grid min-h-48 place-items-center"><Loader2 className="animate-spin text-[#172a69]" /></div>
      ) : error ? (
        <p className="px-6 py-8 text-sm font-semibold text-[#b42318]">{error}</p>
      ) : communities.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <Users className="mx-auto text-[#172a69]" />
          <p className="mt-3 font-extrabold text-[#172a69]">No community yet</p>
          <p className="mt-1 text-sm text-[#667085]">Purchase a course that has a group, and it will show up here and in the app.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#edf1f7]">
          {communities.map((community) => (
            <Link key={community.id} href={`/student/communities?group=${community.id}`} className="flex items-center gap-4 px-6 py-4 transition hover:bg-[#f8fafc]">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#172a69] text-sm font-extrabold text-white">{initials(community.name)}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-extrabold text-[#172a69]">{community.name}</span>
                <span className="mt-0.5 block truncate text-sm text-[#667085]">{community.last_message || community.course_title || "No messages yet"}</span>
              </span>
              <span className="text-xs font-bold text-[#7d8799]">{community.members_count} members</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function CommunityChat({ communityId, onBack }: { communityId: number; onBack: () => void }) {
  const [title, setTitle] = useState("Community");
  const [courseTitle, setCourseTitle] = useState("");
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const lastIdRef = useRef(0);

  const appendMessages = useCallback((incoming: CommunityMessage[], mode: "reset" | "after" | "before") => {
    setMessages((current) => {
      if (mode === "reset") return incoming;
      const seen = new Set(current.map((message) => message.id));
      const fresh = incoming.filter((message) => !seen.has(message.id));
      if (fresh.length === 0) return current;
      return mode === "before" ? [...fresh, ...current] : [...current, ...fresh];
    });
  }, []);

  const load = useCallback(async (mode: "reset" | "after" | "before", cursor?: number) => {
    try {
      const thread = await fetchCommunityMessages(communityId, {
        afterId: mode === "after" ? cursor : undefined,
        beforeId: mode === "before" ? cursor : undefined,
      });
      setTitle(thread.community.name);
      setCourseTitle(thread.community.course_title || "");
      if (mode !== "after") setHasMore(thread.has_more);
      appendMessages(thread.messages, mode);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load messages.");
    }
  }, [appendMessages, communityId]);

  useEffect(() => {
    void load("reset");
    const timer = window.setInterval(() => {
      if (lastIdRef.current) void load("after", lastIdRef.current);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last) lastIdRef.current = last.id;
    const thread = threadRef.current;
    if (thread && stickRef.current) thread.scrollTop = thread.scrollHeight;
  }, [messages]);

  async function submit(event?: FormEvent, file?: File | null) {
    event?.preventDefault();
    if (sending) return;
    const body = text;
    if (!body.trim() && !file) return;
    setSending(true);
    setError("");
    try {
      const message = await sendCommunityMessage(communityId, body, file);
      setText("");
      if (fileRef.current) fileRef.current.value = "";
      stickRef.current = true;
      setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not send.");
    } finally {
      setSending(false);
    }
  }

  async function toggleRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      return;
    }
    if (!navigator.mediaDevices || typeof MediaRecorder === "undefined") {
      setError("This browser cannot record audio.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
      const mime = types.find((type) => MediaRecorder.isTypeSupported(type)) || "";
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const extension = blob.type.includes("mp4") ? "m4a" : "webm";
        const file = new File([blob], `voice-${Date.now()}.${extension}`, { type: blob.type || "audio/webm" });
        void submit(undefined, file);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("Allow microphone access to send a voice message.");
    }
  }

  const oldestId = messages[0]?.id;

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#dfe5ef] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <header className="flex items-center gap-3 bg-[#172a69] px-4 py-3 text-white">
        <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" onClick={onBack} aria-label="Back to communities">
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-extrabold">{title}</h1>
          <p className="truncate text-xs text-white/70">{courseTitle}</p>
        </div>
      </header>
      <div
        ref={threadRef}
        className="flex h-[min(62vh,640px)] flex-col gap-2 overflow-y-auto bg-[#efeae2] px-3 py-4"
        onScroll={(event) => {
          const el = event.currentTarget;
          stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
        }}
      >
        {hasMore && oldestId ? (
          <button type="button" className="mx-auto rounded-full bg-white px-3 py-1 text-xs font-bold text-[#172a69]" onClick={() => void load("before", oldestId)}>
            Load earlier messages
          </button>
        ) : null}
        {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
      </div>
      {error ? <p className="px-4 pt-3 text-sm font-semibold text-[#b42318]">{error}</p> : null}
      <form className="flex items-center gap-2 border-t border-[#edf1f7] p-3" onSubmit={(event) => void submit(event, fileRef.current?.files?.[0])}>
        <input ref={fileRef} type="file" accept="image/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip" hidden onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void submit(undefined, file);
        }} />
        <button type="button" className="grid h-11 w-11 place-items-center rounded-full text-[#172a69] hover:bg-[#f3f6fb]" onClick={() => fileRef.current?.click()} aria-label="Attach photo or document">
          <Paperclip size={18} />
        </button>
        <button type="button" className={`grid h-11 w-11 place-items-center rounded-full ${recording ? "bg-[#b42318] text-white" : "text-[#172a69] hover:bg-[#f3f6fb]"}`} onClick={() => void toggleRecording()} aria-label={recording ? "Stop recording" : "Record voice"}>
          <Mic size={18} />
        </button>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={4000}
          placeholder={recording ? "Recording... tap mic to send" : "Message"}
          className="h-11 flex-1 rounded-full border border-[#e4e8f1] px-4 text-sm outline-none focus:border-[#172a69]"
        />
        <button type="submit" disabled={sending} className="grid h-11 w-11 place-items-center rounded-full bg-[#172a69] text-white disabled:opacity-60" aria-label="Send">
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
    </section>
  );
}
