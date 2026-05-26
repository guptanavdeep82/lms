import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, FileText, Globe2, ShieldCheck } from "lucide-react";

const adminInstructions = [
  "This is a mock test for practice purpose only. Question paper should not be treated as final sample paper.",
  "Total duration is 20 minutes. Timer will start as soon as you begin the test.",
  "You can change the question language during the exam where translation is available.",
  "Do not refresh, close, or switch tabs during the exam. Such activity may be recorded by the system.",
  "Every correct answer carries +1 mark and every wrong answer carries -0.25 marks.",
];

export default function MockInstructionsPage() {
  return (
    <main className="min-h-screen bg-[#eef3f8] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <header className="bg-[#3378b9] text-white shadow-sm">
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <Image src="/logics-logo.jpeg" alt="KR Logics logo" width={36} height={36} className="h-9 w-9 rounded-full border border-[#ffd21f] object-cover shadow-lg shadow-black/20" />
            <div>
              <h1 className="text-[14px] font-semibold sm:text-[16px]">SBI PO 2026 Prelims Mock Test - 1</h1>
              <p className="text-xs text-white/70">Instructions configured by admin</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-xl bg-white/12 px-3 py-2 text-xs font-bold sm:flex">
            <Clock3 size={15} /> 20 min
          </div>
        </div>
      </header>

      <section className="p-4">
        <div className="overflow-hidden rounded-[22px] border border-[#ccd6e2] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="grid min-h-[calc(100vh-120px)] grid-rows-[1fr_auto]">
            <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[1fr_340px]">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf3ff] text-[#2268aa]">
                    <FileText size={23} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#2268aa]">Instructions</p>
                    <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#172a69] sm:text-2xl">Read before you begin</h2>
                  </div>
                </div>

                <div className="h-[300px] overflow-y-auto rounded-2xl border border-[#dfe5ef] bg-[#fbfdff] p-5">
                  <p className="mb-5 text-[15px] leading-7 text-[#111827]">
                    This is a Mock test. Question Paper displayed is for practice purpose only. Under no circumstances should this be presumed as a sample paper.
                  </p>
                  <div className="space-y-3">
                    {adminInstructions.map((instruction, index) => (
                      <div key={instruction} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-[#e5eaf2]">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#3378b9] text-xs font-extrabold text-white">{index + 1}</span>
                        <p className="text-sm font-semibold leading-6 text-[#344054]">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-[#d8dee8] pt-5">
                  <label className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#111827]">
                    Choose your default language:
                    <span className="flex h-10 items-center gap-2 rounded-xl border border-[#cdd6e2] bg-white px-3">
                      <Globe2 size={16} className="text-[#3378b9]" />
                      <select className="bg-transparent text-sm font-bold outline-none">
                        <option>-- Select --</option>
                        <option>English</option>
                        <option>Hindi</option>
                      </select>
                    </span>
                  </label>
                  <p className="mt-3 text-sm font-semibold text-red-600">
                    Please note all questions will appear in your default language. This language can be changed for a particular question later on.
                  </p>
                  <label className="mt-6 flex gap-3 text-sm font-semibold leading-6 text-[#111827]">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-[#9aa8ba]" />
                    <span>
                      I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not carrying any prohibited gadget or material. I agree that in case of not adhering to the instructions, I shall be liable to disciplinary action.
                    </span>
                  </label>
                </div>
              </div>

              <aside className="rounded-[22px] bg-[#f7f9fd] p-5 ring-1 ring-[#e5eaf2]">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#172a69] text-white">
                  <ShieldCheck size={27} />
                </div>
                <h3 className="mt-5 text-xl font-extrabold tracking-[-0.02em] text-[#172a69]">Test Summary</h3>
                <div className="mt-5 space-y-3">
                  {[
                    ["Exam", "SBI PO Prelims"],
                    ["Questions", "100"],
                    ["Sections", "English, Quant, Reasoning"],
                    ["Marks", "+1 / -0.25"],
                    ["Mode", "Online Practice"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-[#e5eaf2]">
                      <span className="font-bold text-[#7d8799]">{label}</span>
                      <span className="text-right font-extrabold text-[#172a69]">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-[#fff8dc] p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 size={19} className="text-[#b77900]" />
                    <p className="text-sm font-bold leading-6 text-[#745100]">Admin can replace this instruction content from backend later.</p>
                  </div>
                </div>
              </aside>
            </div>

            <footer className="flex flex-col items-stretch justify-center gap-3 border-t border-[#d8dee8] bg-[#e4e4e4] px-5 py-4 sm:flex-row sm:items-center">
              <Link href="/student/mock-tests" className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#111827] bg-white px-6 text-sm font-bold text-[#111827]">
                <ArrowLeft size={16} /> Previous
              </Link>
              <Link href="/student/mock-tests/sbi-po-2026/setup" className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#3378b9] px-6 text-sm font-bold text-white shadow-lg shadow-blue-100">
                I&apos;m ready to begin <ArrowRight size={16} />
              </Link>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}
