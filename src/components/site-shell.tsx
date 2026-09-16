import { Bot } from "lucide-react";

export function Header() {
  return null;
}

export function Footer() {
  return null;
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <main className="flex-1">{children}</main>;
}

export function FloatingChat() {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button className="flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-[#f7c843] text-black shadow-2xl shadow-black/20 transition hover:-translate-y-1" aria-label="Open AI chat">
        <Bot size={20} />
      </button>
    </div>
  );
}

export function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-4xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9c7411]">{eyebrow}</p>
      <h2 className="font-display mt-3 text-3xl font-black tracking-tight text-black sm:text-4xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-7 text-black/62">{text}</p> : null}
    </div>
  );
}
