import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type ChatbotHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export type AskChatbotOptions = {
  history?: ChatbotHistoryItem[];
  studentName?: string;
  studentMobile?: string;
  conversationId?: number | null;
  visitorKey?: string | null;
};

export type AskChatbotResult = {
  reply: string;
  conversationId: number;
};

export const CHATBOT_CONVERSATION_STORAGE_KEY = "kr_chatbot_conversation_id";
export const CHATBOT_LEAD_STORAGE_KEY = "kr_chatbot_lead";

export function readStoredConversationId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CHATBOT_CONVERSATION_STORAGE_KEY);
  const id = raw ? Number(raw) : NaN;
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function storeConversationId(id: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHATBOT_CONVERSATION_STORAGE_KEY, String(id));
}

export type ChatbotLead = {
  name: string;
  mobile: string;
};

export function readStoredLead(): ChatbotLead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CHATBOT_LEAD_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ChatbotLead>;
    const name = (parsed.name || "").trim();
    const mobile = (parsed.mobile || "").trim();
    if (!name || !mobile) return null;
    return { name, mobile };
  } catch {
    return null;
  }
}

export function storeLead(lead: ChatbotLead) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHATBOT_LEAD_STORAGE_KEY, JSON.stringify(lead));
}

export async function askChatbot(
  message: string,
  options: AskChatbotOptions = {},
): Promise<AskChatbotResult> {
  const history = options.history ?? [];
  const body: Record<string, unknown> = {
    message,
    history: history.slice(-6),
  };

  if (options.conversationId) {
    body.conversation_id = options.conversationId;
  } else {
    if (options.studentName) body.student_name = options.studentName;
    if (options.studentMobile) body.student_mobile = options.studentMobile;
  }

  if (options.visitorKey) {
    body.visitor_key = options.visitorKey;
  }

  const response = await fetch(`${publicBackendBaseUrl}/api/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as {
    reply?: string;
    conversation_id?: number;
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    const messageText =
      Object.values(data.errors || {})[0]?.[0] || data.message || "Unable to get a reply right now.";
    throw new Error(messageText);
  }

  const reply = (data.reply || "").trim();
  const conversationId = Number(data.conversation_id);
  if (!reply) {
    throw new Error("Empty reply from chatbot.");
  }
  if (!Number.isFinite(conversationId) || conversationId <= 0) {
    throw new Error("Chatbot did not return a conversation id.");
  }

  return { reply, conversationId };
}
