import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, FileText, Globe2, MonitorCheck, ShieldCheck, UserRound } from "lucide-react";

const checks = [
  "Browser fullscreen recommended before starting test.",
  "Question palette, timer and section controls will be visible during test.",
  "You can mark questions for review and change answers before submission.",
  "Final submit ke baad score and analysis page generate hoga.",
];

export default function MockSetupPage() {
  return (
    <main className="min-h-screen bg-[#eef3f8] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <header className="bg-[#3378b9] text-white shadow-sm">
        <div className="flex h-14 items-center justify-between px-5">
          <h1 className="text-[16px] font-semibold">SBI PO 2026 Prelims Mock Test - 1</h1>
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="rounded-lg bg-white/14 px-3 py-1.5">Language: English</span>
            <span className="rounded-lg bg-white/14 px-3 py-1.5">Time: 20 min</span>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-56px)] max-w-6xl items-center gap-6 px-4 py-8 lg:grid-cols-[1fr_420px]">
        <div className="rounded-[28px] bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.09)] ring-1 ring-[#d9e2ee]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf3ff] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#2268aa]">
            <MonitorCheck size={15} /> Test Setup
          </span>
          <h2 className="mt-5 text-[34px] font-extrabold tracking-[-0.04em] text-[#172a69]">Ready screen before exam starts</h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Total Questions", value: "100", icon: FileText },
              { label: "Duration", value: "20 min", icon: Clock3 },
              { label: "Default Language", value: "English", icon: Globe2 },
              { label: "Candidate", value: "Navdeepgupta", icon: UserRound },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#f7f9fd] p-5 ring-1 ring-[#e5eaf2]">
                <item.icon size={21} className="text-[#3378b9]" />
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[#7d8799]">{item.label}</p>
                <p className="mt-1 text-xl font-extrabold text-[#172a69]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 space-y-3">
            {checks.map((check) => (
              <div key={check} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-[#e5eaf2]">
                <CheckCircle2 size={18} className="text-[#21a366]" />
                <p className="text-sm font-semibold text-[#344054]">{check}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] bg-[#172a69] p-7 text-white shadow-[0_24px_70px_rgba(23,42,105,0.24)]">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/12 text-[#f5c518]">
            <ShieldCheck size={28} />
          </div>
          <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.03em]">Exam interface preview</h3>
          <div className="mt-6 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
            <div className="flex items-center justify-between text-sm font-bold">
              <span>Timer</span>
              <span className="rounded-lg bg-white px-3 py-1 text-[#172a69]">00:17:31</span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, index) => (
                <span key={index} className={`grid h-9 place-items-center rounded-lg text-xs font-extrabold ${index < 7 ? "bg-[#d83a0c]" : "bg-white/16"}`}>
                  {index + 1}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-7 flex gap-3">
            <Link href="/student/mock-tests/sbi-po-2026/instructions" className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 text-sm font-bold ring-1 ring-white/16">
              <ArrowLeft size={16} /> Back
            </Link>
            <Link href="/student/mock-tests/sbi-po-2026/exam" className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#f5c518] text-sm font-extrabold text-[#172a69]">
              Next <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
