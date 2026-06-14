import Link from "next/link";
import { BarChart3, Bell, MessageSquare, PlayCircle } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { dashboardTiles } from "@/lib/data";

export default function DashboardPage() {
  return (
    <PageShell>
      <section className="bg-[#10100d] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f7c843]">Student Dashboard</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight">Good evening, student</h1>
            <p className="mt-3 text-white/62">Your courses, live classes, notes, mocks and discussions in one learning cockpit.</p>
          </div>
          <Link href="/courses" className="rounded-md bg-[#f7c843] px-5 py-3 text-sm font-black text-black">Buy Another Course</Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {dashboardTiles.map((tile) => (
          <div key={tile.title} className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
            <tile.icon className="text-[#9c7411]" />
            <p className="mt-4 text-sm text-black/55">{tile.title}</p>
            <p className="mt-1 text-xl font-black">{tile.value}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_0.42fr] lg:px-8">
        <div className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Continue Watching</h2>
            <PlayCircle className="text-[#9c7411]" />
          </div>
          <div className="mt-6 h-3 rounded-full bg-black/10"><div className="h-3 w-[68%] rounded-full bg-[#f7c843]" /></div>
          <div className="mt-6 grid gap-3">
            {["Number Series - Video 18", "Banking Awareness - Video 07", "Insurance Acts - Video 03"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-md bg-[#fbfaf6] p-4">
                <span className="font-bold">{item}</span>
                <button className="rounded-md bg-black px-4 py-2 text-sm font-bold text-white">Resume</button>
              </div>
            ))}
          </div>
        </div>
        <aside className="grid gap-5">
          <div className="rounded-md bg-black p-6 text-white">
            <Bell className="text-[#f7c843]" />
            <h3 className="mt-4 text-xl font-black">Live class today</h3>
            <p className="mt-2 text-sm text-white/60">Reasoning speed session at 7:00 PM via Zoom.</p>
          </div>
          <div className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
            <BarChart3 className="text-[#9c7411]" />
            <h3 className="mt-4 text-xl font-black">Mock rank improved</h3>
            <p className="mt-2 text-sm text-black/60">You moved from rank 540 to 312 in the weekly test.</p>
          </div>
          <div className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
            <MessageSquare className="text-[#9c7411]" />
            <h3 className="mt-4 text-xl font-black">Forum replies</h3>
            <p className="mt-2 text-sm text-black/60">Faculty answered 2 of your Quant doubts.</p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
