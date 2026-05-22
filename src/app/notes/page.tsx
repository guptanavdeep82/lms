import { Download, FileText, Printer } from "lucide-react";
import { PageShell, SectionHeader } from "@/components/site-shell";

export default function NotesPage() {
  const notes = ["Banking Awareness PDF Pack", "Quant Formula Handbook", "Insurance Current Affairs", "Reasoning Puzzle Set"];
  return (
    <PageShell>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Notes Management" title="Paid and free notes after signup" text="PDF and study material access with subject categories, download, print support and subscription based unlocking." />
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {notes.map((note, index) => (
            <div key={note} className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
              <FileText className="text-[#9c7411]" />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div><h2 className="text-xl font-black">{note}</h2><p className="mt-2 text-sm text-black/55">{index < 2 ? "Paid subscription" : "Free after signup"} | PDF material</p></div>
                <span className="rounded-md bg-[#f7c843] px-3 py-2 text-xs font-black">{index < 2 ? "Paid" : "Free"}</span>
              </div>
              <div className="mt-5 flex gap-3">
                <button className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-bold text-white"><Download size={16} /> Download</button>
                <button className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 text-sm font-bold"><Printer size={16} /> Print</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
