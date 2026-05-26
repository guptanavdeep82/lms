import Image from "next/image";
import Link from "next/link";
import { Bot, LogIn, Menu, Search, ShoppingBag } from "lucide-react";
import { navItems } from "@/lib/data";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ffd21f]/25 bg-[#050808]/95 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-black shadow-xl shadow-[#ffd21f]/15 ring-1 ring-[#ffd21f]/25">
            <Image
              src="/logics-logo.jpeg"
              alt="Kaneesh Reena Logics logo"
              width={48}
              height={48}
              className="h-12 w-12 object-cover object-center transition duration-500 group-hover:scale-110"
              priority
            />
          </span>
          <div className="leading-tight">
            <p className="font-display text-2xl font-black tracking-tight text-white">Logics</p>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#ffd21f]">Exam LMS</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.08] p-1 text-sm font-extrabold text-white/72 shadow-sm lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 transition hover:bg-[#ffd21f] hover:text-[#050808]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white/75 shadow-sm transition hover:bg-[#ffd21f] hover:text-[#050808] md:flex" aria-label="Search">
            <Search size={18} />
          </button>
          <Link href="/login" className="hidden h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-5 text-sm font-extrabold text-white/78 shadow-sm transition hover:bg-[#ffd21f] hover:text-[#050808] sm:flex">
            <LogIn size={17} />
            Login
          </Link>
          <Link href="/pricing" className="flex h-11 items-center gap-2 rounded-full bg-[#f7c843] px-5 text-sm font-black text-black shadow-lg shadow-[#f7c843]/25 transition hover:-translate-y-0.5 hover:bg-[#ffd85b]">
            <ShoppingBag size={17} />
            Buy Course
          </Link>
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white lg:hidden" aria-label="Menu">
            <Menu size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#10100d] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logics-logo.jpeg" alt="Logics logo" width={54} height={54} className="rounded-md object-cover" />
            <div>
              <p className="font-black uppercase tracking-[0.2em]">Kaneesh Reena Logics</p>
              <p className="text-sm text-white/55">SBI, RBI, IBPS, Insurance and competitive exams.</p>
            </div>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-6 text-white/65">
            A student-first LMS website concept with course selling, subscriptions, video learning, mock tests, notes, live classes, forum, blog, AI assistant, and WhatsApp support.
          </p>
        </div>
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#f7c843]">Explore</p>
          <div className="grid gap-3 text-sm text-white/70">
            {navItems.slice(0, 6).map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">{item.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#f7c843]">Student Support</p>
          <div className="grid gap-3 text-sm text-white/70">
            <span>OTP login and Google sign-in</span>
            <span>Gallabox WhatsApp automation</span>
            <span>AI website chat assistant</span>
            <span>Secure subscription access</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/45">
        (c) 2026 Kaneesh Reena Logics LMS. Public website design prototype.
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <FloatingChat />
      <Footer />
    </>
  );
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
      <h2 className="font-display mt-3 text-4xl font-black tracking-tight text-black sm:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-7 text-black/62">{text}</p> : null}
    </div>
  );
}
