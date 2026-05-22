import { MessageCircle, Send, Tags } from "lucide-react";
import { PageShell, SectionHeader } from "@/components/site-shell";

export default function ForumPage() {
  const questions = ["How to solve seating arrangement faster?", "Which insurance current affairs PDF should I revise?", "Can faculty explain approximation shortcut?"];
  return (
    <PageShell>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Forum and Discussion" title="Subject-wise doubt solving community" text="Students ask questions, faculty/admins reply, and categories keep the learning discussion searchable." />
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.65fr_0.35fr]">
          <div className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Recent Questions</h2>
            <div className="mt-5 grid gap-3">
              {questions.map((question) => (
                <div key={question} className="rounded-md bg-[#fbfaf6] p-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="mt-1 text-[#9c7411]" size={20} />
                    <div>
                      <p className="font-black">{question}</p>
                      <p className="mt-1 text-sm text-black/55">Faculty reply pending | Reasoning category</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-md bg-black p-6 text-white">
            <Tags className="text-[#f7c843]" />
            <h3 className="mt-4 text-2xl font-black">Ask a new question</h3>
            <textarea className="mt-5 h-32 w-full rounded-md border border-white/10 bg-white/10 p-3 text-sm outline-none" placeholder="Type your doubt..." />
            <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#f7c843] px-5 py-3 text-sm font-black text-black"><Send size={16} /> Post Question</button>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
