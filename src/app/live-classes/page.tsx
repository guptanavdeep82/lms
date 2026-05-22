import { CalendarDays, Radio, Users } from "lucide-react";
import { PageShell, SectionHeader } from "@/components/site-shell";

export default function LiveClassesPage() {
  const sessions = ["Reasoning Speed Booster", "Quant Doubt Solving", "Banking Awareness Weekly", "Insurance Exam Strategy"];
  return (
    <PageShell>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Live Streaming Classes" title="Scheduled Zoom and Google Meet classes" text="Join access, notifications, attendance tracking and session management for students." />
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.4fr_0.6fr]">
          <aside className="rounded-md bg-black p-6 text-white">
            <Radio className="text-[#f7c843]" />
            <h2 className="mt-5 text-3xl font-black">Today at 7:00 PM</h2>
            <p className="mt-3 text-white/62">Reasoning speed booster live session with attendance tracking.</p>
            <button className="mt-8 rounded-md bg-[#f7c843] px-5 py-3 text-sm font-black text-black">Join Live Class</button>
          </aside>
          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((session) => (
              <div key={session} className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
                <CalendarDays className="text-[#9c7411]" />
                <h3 className="mt-4 text-xl font-black">{session}</h3>
                <p className="mt-2 text-sm text-black/55">Google Meet / Zoom integration ready.</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-black/65"><Users size={17} /> Attendance enabled</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
