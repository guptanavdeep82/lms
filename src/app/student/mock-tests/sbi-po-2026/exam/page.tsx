import Link from "next/link";
import { ChevronRight, Clock3, Expand, Flag, HelpCircle, Pause, UserRound, X } from "lucide-react";

const questionNumbers = Array.from({ length: 28 }, (_, index) => index + 1);
const options = ["negligible", "marginal", "significant", "arbitrary", "tentative"];

export default function MockExamPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="flex h-[50px] items-center justify-between bg-[#3378b9] px-5 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#c4008f] text-sm font-bold">DG</div>
          <h1 className="text-[14px] font-medium">SBI PO 2026 Prelims Mock Test - 1</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 items-center rounded bg-white px-2 text-sm text-[#1f4f86]">
            Time Left: <span className="ml-2 rounded bg-[#d8ebff] px-2 py-1 font-mono font-bold text-[#174b82]">00 : 17 : 31</span>
          </div>
          <button className="grid h-9 w-[60px] place-items-center rounded bg-white text-sm text-[#2768a5]"><Pause size={15} />Pause</button>
          <button className="grid h-9 w-9 place-items-center rounded bg-white text-[#2768a5]"><Expand size={17} /></button>
        </div>
      </header>

      <div className="grid h-[calc(100vh-50px)] grid-cols-[1fr_260px]">
        <section className="grid grid-rows-[40px_1fr_58px] overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#cfd7df] bg-[#f6f6f6] px-2 text-sm">
            <a href="#" className="font-bold text-[#0f60b5] underline">English Language</a>
            <div className="flex items-center gap-3">
              <select className="h-28px rounded border border-[#111827] bg-white px-2 py-1 text-base">
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-rows-[40px_1fr] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#cfd7df] px-2 text-sm">
              <span>Q: 7 / 100</span>
              <div className="flex items-center gap-5">
                <span className="rounded border border-[#cfd7df] px-3 py-1">Qn. Time : <Clock3 size={12} className="inline" /></span>
                <span><b>Marks :</b> <span className="text-[#00a651]">+1</span> | <span className="text-[#ff3950]">-0.25</span></span>
              </div>
            </div>

            <div className="grid grid-cols-2 overflow-hidden">
              <div className="overflow-y-auto border-r border-[#cfd7df] p-3 text-[18px] leading-8">
                <p className="mb-4 font-bold">In the given question, sentences are given in jumbled form. Rearrange them in proper order and answer the questions that follow.</p>
                <p><b>A)</b> This initial capital is crucial as it allows entrepreneurs to move beyond the ideation phase and into product development.</p>
                <p className="mt-4"><b>B)</b> Venture capital serves as the lifeblood for early-stage companies that lack access to traditional bank loans due to their high-risk nature.</p>
                <p className="mt-4"><b>C)</b> However, the risk of failure remains high at this stage, often leading investors to demand ________ equity in exchange for their support.</p>
                <p className="mt-4"><b>D)</b> Once a prototype is proven successful, these startups then seek &quot;Series A&quot; funding to scale their operations globally.</p>
                <p className="mt-4"><b>E)</b> It typically begins with &quot;Seed Funding,&quot; where investors provide small amounts of money to test a business concept.</p>
              </div>

              <div className="overflow-y-auto p-4 text-[18px] leading-8">
                <h2 className="mb-3 font-bold">Fill in the blank.</h2>
                <p>However, the risk of failure remains high at this stage, often leading investors to demand ________ equity in exchange for their support.</p>
                <div className="mt-4 space-y-4">
                  {options.map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-3">
                      <span className="h-5 w-5 rounded-full border border-[#c4c4c4]" />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="flex items-center justify-between border-t border-[#cfd7df] bg-[#efefef] px-4">
            <div className="flex gap-5">
              <button className="h-40px rounded-lg border border-[#8dc8ff] bg-[#cae7ff] px-4 py-2 text-sm">Mark for review &amp; next</button>
              <button className="h-40px rounded-lg border border-[#8dc8ff] bg-[#cae7ff] px-4 py-2 text-sm">Clear Response</button>
            </div>
            <Link href="/student/mock-tests/sbi-po-2026/exam" className="rounded-lg bg-[#2f78bf] px-5 py-2 text-sm font-bold text-white shadow">
              Save &amp; Next
            </Link>
          </footer>
        </section>

        <aside className="grid grid-rows-[50px_88px_1fr_58px] border-l border-[#cfd7df] bg-[#eef9ff]">
          <div className="flex items-center gap-3 bg-[#dff5ff] px-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#607d8b]"><UserRound size={24} /></div>
            <span className="text-sm">Navdeepgupta</span>
          </div>

          <div className="bg-[#f2f2f2] px-4 py-2 text-sm">
            <p className="mb-2 text-right">Time Left: <b className="ml-2 rounded bg-white px-2 py-1 font-mono">00 : 17 : 31</b></p>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-xs">
              <span className="flex items-center gap-2"><b className="grid h-6 w-7 place-items-center rounded bg-[#6bbd21] text-white">0</b> Answered</span>
              <span className="flex items-center gap-2"><b className="grid h-6 w-7 place-items-center rounded bg-[#d83a0c] text-white">7</b> Not Answered</span>
              <span className="flex items-center gap-2"><b className="grid h-6 w-7 place-items-center rounded bg-[#e8e8e8] text-[#111]">33</b> Not Visited</span>
              <span className="flex items-center gap-2"><b className="grid h-6 w-7 place-items-center rounded-full bg-[#7b4ea3] text-white">0</b> Marked for Review</span>
            </div>
          </div>

          <div className="overflow-y-auto p-4">
            <h3 className="mb-4 bg-[#e8e8e8] py-2 text-center text-sm font-bold">English Language</h3>
            <div className="grid grid-cols-4 gap-3">
              {questionNumbers.map((num) => (
                <button
                  key={num}
                  className={`h-11 rounded border text-sm ${
                    num <= 7
                      ? "border-[#9b2a05] bg-[#d83a0c] font-bold text-white"
                      : "border-[#9d9d9d] bg-gradient-to-b from-white to-[#d9d9d9] text-[#333]"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <button className="absolute right-[252px] top-[386px] hidden h-14 w-7 place-items-center rounded-l bg-[#444] text-white xl:grid">
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="flex items-center justify-center border-t border-[#cfd7df] bg-[#efefef] px-4">
            <button className="h-10 w-full rounded bg-[#2f78bf] text-sm font-bold text-white shadow">Submit section</button>
          </div>
        </aside>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[45px] grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full bg-[#3f3f3f] text-white">
        <X size={24} />
      </div>
      <div className="fixed bottom-4 right-4 hidden rounded-full bg-[#3378b9] p-3 text-white shadow-lg md:block">
        <HelpCircle size={20} />
      </div>
      <div className="fixed bottom-4 left-4 hidden rounded-full bg-[#3378b9] p-3 text-white shadow-lg md:block">
        <Flag size={20} />
      </div>
    </main>
  );
}
