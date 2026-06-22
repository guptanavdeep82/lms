import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  FileText,
  PlayCircle,
  ShieldCheck,
  Star,
  UsersRound,
} from "lucide-react";
import { PublicPageShell } from "@/components/PublicPageShell";
import { CoursePurchaseActions } from "@/components/payments/CoursePurchaseActions";
import { fetchCourseBySlug, mapApiCourseToCatalogItem } from "@/lib/courses";

export const dynamic = "force-dynamic";

function CourseImage({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return <img src={src} alt={alt} className="h-full w-full object-cover" />;
  }

  return <Image src={src} alt={alt} fill className="object-cover" priority unoptimized />;
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await fetchCourseBySlug(slug);
  if (!payload?.course) notFound();

  const course = mapApiCourseToCatalogItem(payload.course, payload.lessons);
  const isPdfCourse = course.courseType === "pdf";
  const isLiveCourse = course.courseType === "live";

  const courseTypeLabel = isPdfCourse ? "PDF Course" : isLiveCourse ? "Live Class Course" : "Video Course";
  const price = course.price === 0 ? "Free" : `Rs ${course.price.toLocaleString("en-IN")}`;
  const original = course.original ? `Rs ${course.original.toLocaleString("en-IN")}` : null;
  const pdfUrl = course.pdfUrl;

  return (
    <PublicPageShell active="courses" className="min-h-screen bg-[#f7f6ef] text-[#151515]">

      <section className="bg-[#050808] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.82fr]">
          <div>
            <Link href="/courses" className="text-sm font-bold text-[#ffd21f]">← Back to courses</Link>
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#ffd21f]/20 bg-[#111] shadow-2xl">
              <div className="relative h-56 w-full sm:h-72">
                <CourseImage src={course.image} alt={course.title} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {[courseTypeLabel, course.category, course.exam, course.level, course.badge].filter(Boolean).map((item) => (
                <span key={item} className="rounded-full border border-[#ffd21f]/25 bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#ffd21f]">
                  {item}
                </span>
              ))}
            </div>
            <h1 className="mt-5 max-w-4xl font-['Sora'] text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{course.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/70">{course.desc}</p>

            <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [Clock3, isPdfCourse ? "Lifetime" : `${course.hours}+ hrs`, isPdfCourse ? "PDF access" : isLiveCourse ? "Live sessions" : "Video content"],
                [FileText, `${course.tests}+`, "Tests"],
                [UsersRound, course.students.toLocaleString("en-IN"), "Students"],
                [Star, course.rating.toFixed(1), `${course.reviews} reviews`],
              ].map(([Icon, value, label]) => (
                <div key={label as string} className="rounded-lg border border-white/10 bg-white/8 p-4">
                  <Icon className="mb-3 size-5 text-[#ffd21f]" />
                  <div className="font-['Sora'] text-xl font-extrabold text-white">{value as string}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/45">{label as string}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="overflow-hidden rounded-2xl border border-[#ffd21f]/20 bg-white p-3 text-[#050808] shadow-2xl shadow-black/30">
            <div className="p-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6500]">Course Price</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-['Sora'] text-4xl font-extrabold">{price}</span>
                    {original ? <span className="text-sm font-bold text-slate-400 line-through">{original}</span> : null}
                  </div>
                </div>
                <span className="rounded-full bg-[#fff8dc] px-3 py-1 text-xs font-extrabold text-[#050808]">Limited offer</span>
              </div>

              <CoursePurchaseActions
                courseId={payload.course.id}
                courseSlug={slug}
                courseTitle={course.title}
                price={course.price}
                isPdfCourse={isPdfCourse}
                isLiveCourse={isLiveCourse}
              />

              {isLiveCourse ? (
                <Link
                  href={`/live-classes/course/${slug}`}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#ded9c8] bg-[#fff8dc] text-sm font-extrabold text-[#050808]"
                >
                  <PlayCircle className="size-4" /> View Class Schedule
                </Link>
              ) : null}

              {isPdfCourse && pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#ded9c8] bg-[#fff8dc] text-sm font-extrabold text-[#050808]"
                >
                  Download Course PDF
                </a>
              ) : null}

              <div className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#8a6500]" /> Secure payment and student login</span>
                <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#8a6500]" /> Course access starts after purchase</span>
                <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#8a6500]" /> {isPdfCourse ? "Downloadable study notes included" : isLiveCourse ? "Live classes and replays included" : "Mock tests and notes included"}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-6">
          <article className="rounded-xl border border-[#ded9c8] bg-white p-6 shadow-sm">
            <h2 className="font-['Sora'] text-2xl font-extrabold text-[#050808]">What you will learn</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg bg-[#f7f6ef] p-4">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#8a6500]" />
                  <span className="text-sm font-semibold leading-6 text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-[#ded9c8] bg-white p-6 shadow-sm">
            <h2 className="font-['Sora'] text-2xl font-extrabold text-[#050808]">Course curriculum</h2>
            <div className="mt-6 grid gap-3">
              {course.curriculum.map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-lg border border-[#ded9c8] p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-[#050808] text-xs font-extrabold text-[#ffd21f]">{index + 1}</span>
                    <span className="font-bold text-[#050808]">{item}</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Lessons included</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="grid content-start gap-5">
          <div className="rounded-xl border border-[#ded9c8] bg-white p-6 shadow-sm">
            <h3 className="font-['Sora'] text-xl font-extrabold text-[#050808]">This course includes</h3>
            <div className="mt-5 grid gap-4 text-sm font-semibold text-slate-700">
              {course.includes.map((item) => (
                <span key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-[#8a6500]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#050808] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffd21f]">Need Guidance?</p>
            <h3 className="mt-3 font-['Sora'] text-xl font-extrabold">Not sure this course is right?</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">Talk to counselling team and pick the right batch, mock test pack and study plan.</p>
            <Link href="/contact" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#ffd21f] text-sm font-extrabold text-[#050808]">
              Contact Counsellor
            </Link>
          </div>
        </aside>
      </section>
    </PublicPageShell>
  );
}
