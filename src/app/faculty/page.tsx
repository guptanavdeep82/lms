import { BookOpen, CheckCircle2, Clock, Star, Trophy, Users } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { fetchHomePageData, type HomePageFaculty } from "@/lib/home-page";

export const dynamic = "force-dynamic";

const strengths = [
  "Live doubt classes every week",
  "Exam-pattern teaching plans",
  "Personal score improvement tracking",
  "Topic-wise revision strategy",
];

const facultyTones = ["bg-[#1b2e6b]", "bg-emerald-600", "bg-blue-600", "bg-orange-600", "bg-violet-600", "bg-amber-600"];

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "KR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function FacultyAvatar({ faculty, tone }: { faculty: HomePageFaculty; tone: string }) {
  if (faculty.image_url) {
    return (
      <div className={`absolute left-1/2 top-14 size-20 -translate-x-1/2 overflow-hidden rounded-full border-4 border-white shadow-lg ${tone}`}>
        <img src={faculty.image_url} alt={faculty.title} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`absolute left-1/2 top-14 grid size-20 -translate-x-1/2 place-items-center rounded-full border-4 border-white ${tone} font-rajdhani text-3xl font-bold text-white shadow-lg`}>
      {initialsFromName(faculty.title)}
    </div>
  );
}

export default async function FacultyPage() {
  const homeData = await fetchHomePageData();
  const faculties = homeData?.faculties ?? [];

  return (
    <main className="min-h-screen bg-[#f8f9fc] text-slate-950">
      <PublicHeader active="faculty" />

      <section className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-[#fff9e0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b78600]">
              Expert Mentors
            </div>
            <h1 className="font-rajdhani text-3xl font-bold leading-tight text-[#1b2e6b] sm:text-4xl lg:text-5xl lg:leading-[0.95]">
              Learn From Faculty Who Know The Exam Inside Out
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              KR Logics faculty focuses on banking exam clarity, speed, accuracy and daily practice discipline. Every subject is taught with exam-level examples and performance feedback.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {[
                [`${faculties.length || 0}+`, "Expert faculty"],
                ["850+", "Selections"],
                ["4.9/5", "Student rating"],
              ].map(([value, label]) => (
                <div key={label as string} className="rounded-lg border border-slate-200 bg-[#f8f9fc] p-4">
                  <div className="font-rajdhani text-3xl font-bold text-[#1b2e6b]">{value as string}</div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label as string}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#1b2e6b] p-4 text-white shadow-2xl shadow-slate-900/15 sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e8a800]">Our Team</div>
              <h2 className="font-rajdhani text-2xl font-bold text-[#1b2e6b] sm:text-3xl">Faculty Panel</h2>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              <Star className="size-4 fill-[#f5c518] text-[#f5c518]" />
              {faculties.length ? `${faculties.length} active mentors` : "Faculty profiles loading from admin"}
            </div>
          </div>

          {!faculties.length ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-semibold text-slate-500">
              No faculty profiles have been published yet. Add mentors from Admin → Home Page → Our Faculty.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {faculties.map((member, index) => {
                const tone = facultyTones[index % facultyTones.length];
                const focus = member.course_keywords.length
                  ? member.course_keywords.join(", ")
                  : "Banking exam preparation mentor";

                return (
                  <article key={member.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-28 bg-gradient-to-br from-slate-100 to-slate-200">
                      <FacultyAvatar faculty={member} tone={tone} />
                    </div>
                    <div className="px-5 pb-5 pt-12 text-center">
                      <h3 className="font-rajdhani text-xl font-bold text-[#1b2e6b]">{member.title}</h3>
                      <div className="mt-1 text-xs font-bold uppercase tracking-wide text-[#e8a800]">{member.designation}</div>
                      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{focus}</p>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-left">
                        <div className="rounded-lg bg-[#f8f9fc] p-3">
                          <Clock className="mb-1 size-4 text-[#1b2e6b]" />
                          <div className="text-sm font-bold text-slate-900">{member.experience?.trim() || "Experienced"}</div>
                          <div className="text-[10px] font-semibold uppercase text-slate-500">Experience</div>
                        </div>
                        <div className="rounded-lg bg-[#f8f9fc] p-3">
                          <Users className="mb-1 size-4 text-[#1b2e6b]" />
                          <div className="text-sm font-bold text-slate-900">Mentor</div>
                          <div className="text-[10px] font-semibold uppercase text-slate-500">Support</div>
                        </div>
                      </div>
                      {member.course_keywords.length ? (
                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                          {member.course_keywords.map((keyword) => (
                            <span key={`${member.id}-${keyword}`} className="rounded-lg bg-[#fff9e0] px-3 py-2 text-xs font-bold text-[#8a6500]">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3">
          {[
            [BookOpen, "Structured lessons", "Every topic moves from concept to exam-level practice."],
            [Users, "Personal mentoring", "Students get guidance based on mock test reports."],
            [Trophy, "Result orientation", "Teaching is focused on selection, not only syllabus completion."],
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="rounded-xl border border-slate-200 p-6">
              <Icon className="mb-4 size-8 text-[#1b2e6b]" />
              <h3 className="font-rajdhani text-xl font-bold text-[#1b2e6b]">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text as string}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
