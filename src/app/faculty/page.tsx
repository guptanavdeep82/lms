import { BookOpen, CheckCircle2, Clock, Star, Trophy, Users } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";

const faculty = [
  {
    initials: "KR",
    name: "Karan Rajput",
    role: "Founder & Director",
    focus: "Reasoning, Quant, Exam Strategy",
    experience: "10+ years",
    result: "420+ selections mentored",
    tone: "bg-[#1b2e6b]",
  },
  {
    initials: "AM",
    name: "Ankita Mehra",
    role: "English Expert",
    focus: "Reading, Grammar, Descriptive English",
    experience: "8 years",
    result: "98 percentile student batches",
    tone: "bg-emerald-600",
  },
  {
    initials: "RS",
    name: "Rohit Sharma",
    role: "Quant Specialist",
    focus: "DI, Arithmetic, Speed Maths",
    experience: "9 years",
    result: "300+ rank improvers",
    tone: "bg-blue-600",
  },
  {
    initials: "PK",
    name: "Priya Kumari",
    role: "Banking & GK Mentor",
    focus: "Current Affairs, Banking Awareness",
    experience: "7 years",
    result: "Daily CA program lead",
    tone: "bg-orange-600",
  },
];

const strengths = [
  "Live doubt classes every week",
  "Exam-pattern teaching plans",
  "Personal score improvement tracking",
  "Topic-wise revision strategy",
];

export default function FacultyPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fc] text-slate-950">
      <PublicHeader active="faculty" />

      <section className="border-b border-slate-200 bg-white px-8 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-[1.05fr_0.95fr] items-center gap-12">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-[#fff9e0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b78600]">
              Expert Mentors
            </div>
            <h1 className="font-rajdhani text-6xl font-bold leading-[0.95] text-[#1b2e6b]">
              Learn From Faculty Who Know The Exam Inside Out
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              KR Logics faculty focuses on banking exam clarity, speed, accuracy and daily practice discipline. Every subject is taught with exam-level examples and performance feedback.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["35K+", "Doubts solved"],
                ["850+", "Selections"],
                ["4.9/5", "Student rating"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-[#f8f9fc] p-4">
                  <div className="font-rajdhani text-3xl font-bold text-[#1b2e6b]">{value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#1b2e6b] p-6 text-white shadow-2xl shadow-slate-900/15">
            <div className="grid grid-cols-2 gap-4">
              {strengths.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/10 p-4">
                  <CheckCircle2 className="mb-3 size-6 text-[#f5c518]" />
                  <div className="text-sm font-semibold leading-6">{item}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-white p-5 text-[#1b2e6b]">
              <div className="flex items-center gap-3">
                <Trophy className="size-8 text-[#e8a800]" />
                <div>
                  <div className="font-rajdhani text-2xl font-bold">Selection-focused mentorship</div>
                  <p className="text-sm text-slate-600">Faculty sessions are planned around weak topics, mock test analysis and revision windows.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e8a800]">Our Team</div>
              <h2 className="font-rajdhani text-4xl font-bold text-[#1b2e6b]">Faculty Panel</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              <Star className="size-4 fill-[#f5c518] text-[#f5c518]" />
              4.9 average teaching rating
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {faculty.map((member) => (
              <article key={member.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-28 bg-gradient-to-br from-slate-100 to-slate-200">
                  <div className={`absolute left-1/2 top-14 grid size-20 -translate-x-1/2 place-items-center rounded-full border-4 border-white ${member.tone} font-rajdhani text-3xl font-bold text-white shadow-lg`}>
                    {member.initials}
                  </div>
                </div>
                <div className="px-5 pb-5 pt-12 text-center">
                  <h3 className="font-rajdhani text-2xl font-bold text-[#1b2e6b]">{member.name}</h3>
                  <div className="mt-1 text-xs font-bold uppercase tracking-wide text-[#e8a800]">{member.role}</div>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{member.focus}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-left">
                    <div className="rounded-lg bg-[#f8f9fc] p-3">
                      <Clock className="mb-1 size-4 text-[#1b2e6b]" />
                      <div className="text-sm font-bold text-slate-900">{member.experience}</div>
                      <div className="text-[10px] font-semibold uppercase text-slate-500">Experience</div>
                    </div>
                    <div className="rounded-lg bg-[#f8f9fc] p-3">
                      <Users className="mb-1 size-4 text-[#1b2e6b]" />
                      <div className="text-sm font-bold text-slate-900">Mentor</div>
                      <div className="text-[10px] font-semibold uppercase text-slate-500">Support</div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg bg-[#fff9e0] px-3 py-2 text-xs font-bold text-[#8a6500]">{member.result}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-8 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-5">
          {[
            [BookOpen, "Structured lessons", "Every topic moves from concept to exam-level practice."],
            [Users, "Personal mentoring", "Students get guidance based on mock test reports."],
            [Trophy, "Result orientation", "Teaching is focused on selection, not only syllabus completion."],
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="rounded-xl border border-slate-200 p-6">
              <Icon className="mb-4 size-8 text-[#1b2e6b]" />
              <h3 className="font-rajdhani text-2xl font-bold text-[#1b2e6b]">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text as string}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
