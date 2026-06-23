"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, FileText, Globe2, Loader2, ShieldCheck } from "lucide-react";
import { isStudentLoggedIn } from "@/lib/student-auth";
import { mockTestsApiUrl, type MockTestDetailResponse } from "@/lib/mock-tests";

export default function DynamicMockInstructionsPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [data, setData] = useState<MockTestDetailResponse | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const target = `/student/mock-tests/${slug}/instructions`;
    if (!isStudentLoggedIn()) {
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    fetch(mockTestsApiUrl(slug))
      .then((response) => {
        if (!response.ok) throw new Error("Not found");
        return response.json();
      })
      .then((payload: MockTestDetailResponse) => {
        if (payload.test.is_locked) {
          router.replace(`/mock-tests/${payload.test.category_slug ?? ""}`);
          return;
        }

        setData(payload);
      })
      .catch(() => router.replace("/mock-tests"))
      .finally(() => setLoading(false));
  }, [router, slug]);

  if (loading || !data) {
    return <LoadingScreen />;
  }

  const test = data.test;
  const sections = Array.from(new Set(data.questions.map((question) => question.section_name))).join(", ") || "General";
  const instructions = [
    test.instructions || "Read all instructions carefully before starting the exam.",
    `Total duration is ${test.duration_minutes} minutes. Timer will start as soon as you begin the test.`,
    `This test has ${test.questions_count} questions and total marks are ${test.total_marks}.`,
    "Do not refresh, close, or switch tabs during the exam.",
    "You can change your answer before final submission.",
  ];

  return (
    <main className="min-h-screen bg-[#eef3f8] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <header className="bg-[#3378b9] text-white shadow-sm">
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <Image src="/kr-logics-logo.png" alt="KR Logics logo" width={36} height={36} className="h-9 w-9 rounded-full border border-[#0066ff] object-cover shadow-lg shadow-black/20" />
            <div>
              <h1 className="text-[14px] font-semibold sm:text-[16px]">{test.title}</h1>
              <p className="text-xs text-white/70">Instructions configured by admin</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-xl bg-white/12 px-3 py-2 text-xs font-bold sm:flex">
            <Clock3 size={15} /> {test.duration_minutes} min
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
                  <div className="space-y-3">
                    {instructions.map((instruction, index) => (
                      <div key={`${instruction}-${index}`} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-[#e5eaf2]">
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
                        <option>English</option>
                        <option>Hindi</option>
                      </select>
                    </span>
                  </label>
                  <label className="mt-6 flex gap-3 text-sm font-semibold leading-6 text-[#111827]">
                    <input checked={accepted} onChange={(event) => setAccepted(event.target.checked)} type="checkbox" className="mt-1 h-5 w-5 rounded border-[#9aa8ba]" />
                    <span>I have read and understood the instructions and I am ready to start this mock test.</span>
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
                    ["Exam", test.title],
                    ["Questions", String(test.questions_count)],
                    ["Sections", sections],
                    ["Marks", String(test.total_marks)],
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
                    <p className="text-sm font-bold leading-6 text-[#745100]">This content is loaded from admin-created mock test data.</p>
                  </div>
                </div>
              </aside>
            </div>

            <footer className="flex flex-col items-stretch justify-center gap-3 border-t border-[#d8dee8] bg-[#e4e4e4] px-5 py-4 sm:flex-row sm:items-center">
              <Link href="/mock-tests" className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#111827] bg-white px-6 text-sm font-bold text-[#111827]">
                <ArrowLeft size={16} /> Previous
              </Link>
              <button
                disabled={!accepted}
                onClick={() => router.push(`/student/mock-tests/${slug}/setup`)}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#3378b9] px-6 text-sm font-bold text-white shadow-lg shadow-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                I&apos;m ready to begin <ArrowRight size={16} />
              </button>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}

function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#eef3f8]">
      <Loader2 className="animate-spin text-[#3378b9]" size={34} />
    </main>
  );
}
