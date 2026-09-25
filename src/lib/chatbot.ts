import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type ChatbotHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export async function askChatbot(
  message: string,
  history: ChatbotHistoryItem[] = [],
): Promise<string> {
  const response = await fetch(`${publicBackendBaseUrl}/api/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history: history.slice(-6),
    }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    reply?: string;
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    const messageText =
      Object.values(data.errors || {})[0]?.[0] || data.message || "Unable to get a reply right now.";
    throw new Error(messageText);
  }

  const reply = (data.reply || "").trim();
  if (!reply) {
    throw new Error("Empty reply from chatbot.");
  }

  return reply;
}
