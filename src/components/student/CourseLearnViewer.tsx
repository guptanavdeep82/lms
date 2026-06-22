"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2, Lock, PlayCircle } from "lucide-react";
import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { fetchStudentAccess } from "@/lib/checkout";
import { fetchCourseBySlug, type ApiCourseLesson } from "@/lib/courses";
import { isDirectVideoUrl, youtubeEmbedUrl } from "@/lib/lesson-video";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";

function LessonVideoPlayer({ url }: { url: string }) {
  const embedUrl = youtubeEmbedUrl(url);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title="Course lesson video"
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isDirectVideoUrl(url)) {
    return (
      <video src={url} controls className="h-full w-full bg-black object-contain">
        <track kind="captions" />
      </video>
    );
  }

  return (
    <iframe
      src={url}
      title="Course lesson video"
      className="h-full w-full border-0"
      allowFullScreen
    />
  );
}

function CourseThumb({ imageUrl, title, gradient }: { imageUrl: string | null; title: string; gradient: string }) {
  if (imageUrl) {
    return (
      <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
    );
  }

  return <div className={`h-full w-full bg-gradient-to-br ${gradient}`} />;
}

const gradients = [
  "from-[#172a69] via-[#2350b8] to-[#13a38b]",
  "from-[#0f9f78] via-[#19b98a] to-[#f5c518]",
  "from-[#243580] via-[#6d5dfc] to-[#e8a800]",
];

export function CourseLearnViewer() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [lessons, setLessons] = useState<ApiCourseLesson[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

  useEffect(() => {
    if (!isStudentLoggedIn()) {
      router.replace(`/login?redirect=${encodeURIComponent(`/student/courses/${slug}/learn`)}`);
      return;
    }

    const session = getStudentSession();
    if (!session?.email) {
      setLoading(false);
      return;
    }

    fetchCourseBySlug(slug)
      .then(async (payload) => {
        if (!payload?.course) {
          router.replace("/student/courses");
          return;
        }

        const access = await fetchStudentAccess(session.email, "course", payload.course.id);
        setHasAccess(access);
        setCourseTitle(payload.course.title);
        setCourseImage(payload.course.image_url);
        setLessons(payload.lessons || []);

        const firstPlayable = payload.lessons.find((lesson) => access || lesson.is_preview);
        setActiveLessonId(firstPlayable?.id ?? payload.lessons[0]?.id ?? null);
      })
      .finally(() => setLoading(false));
  }, [router, slug]);

  const activeLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeLessonId) ?? null,
    [lessons, activeLessonId],
  );

  const canWatchLesson = (lesson: ApiCourseLesson) => hasAccess || lesson.is_preview;

  if (loading) {
    return (
      <StudentDashboardShell>
        <div className="grid min-h-[320px] place-items-center">
          <Loader2 className="size-8 animate-spin text-[#172a69]" />
        </div>
      </StudentDashboardShell>
    );
  }

  return (
    <StudentDashboardShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/student/courses" className="inline-flex items-center gap-2 text-sm font-bold text-[#667085] hover:text-[#172a69]">
            <ArrowLeft size={16} /> Back to My Courses
          </Link>
          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#172a69]">{courseTitle}</h1>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-[24px] border border-[#dfe5ef] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="relative aspect-video bg-[#050808]">
            {activeLesson?.video_url && canWatchLesson(activeLesson) ? (
              <LessonVideoPlayer url={activeLesson.video_url} />
            ) : (
              <div className="grid h-full place-items-center p-8 text-center">
                {activeLesson && !canWatchLesson(activeLesson) ? (
                  <>
                    <Lock className="mb-3 size-10 text-[#94a3b8]" />
                    <p className="text-sm font-bold text-[#667085]">Purchase this course to unlock lesson videos.</p>
                    <Link href={`/courses/${slug}`} className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#172a69] px-4 text-xs font-extrabold text-white">
                      View Course
                    </Link>
                  </>
                ) : (
                  <>
                    <PlayCircle className="mb-3 size-10 text-[#94a3b8]" />
                    <p className="text-sm font-bold text-[#667085]">No video uploaded for this lesson yet.</p>
                  </>
                )}
              </div>
            )}
          </div>

          {activeLesson ? (
            <div className="border-t border-[#eef2f7] p-5">
              <h2 className="text-lg font-extrabold text-[#111827]">{activeLesson.title}</h2>
              {activeLesson.description ? (
                <p className="mt-2 text-sm font-medium leading-6 text-[#667085]">{activeLesson.description}</p>
              ) : null}
              {activeLesson.resource_url && canWatchLesson(activeLesson) ? (
                <a
                  href={activeLesson.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-[#dfe5ef] px-4 text-xs font-extrabold text-[#172a69]"
                >
                  <FileText size={16} /> Download Resource
                </a>
              ) : null}
            </div>
          ) : null}
        </section>

        <aside className="overflow-hidden rounded-[24px] border border-[#dfe5ef] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="relative h-28 overflow-hidden">
            <CourseThumb imageUrl={courseImage} title={courseTitle} gradient={gradients[0]} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <p className="absolute bottom-3 left-4 right-4 text-sm font-extrabold text-white">{courseTitle}</p>
          </div>

          <div className="max-h-[520px] overflow-y-auto p-3">
            <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7d8799]">Lessons</p>
            <div className="grid gap-2">
              {lessons.map((lesson, index) => {
                const playable = canWatchLesson(lesson);
                const isActive = lesson.id === activeLessonId;

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                      isActive ? "border-[#172a69] bg-[#eef3ff]" : "border-[#eef2f7] bg-white hover:border-[#cfd8ea]"
                    }`}
                  >
                    <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-extrabold ${isActive ? "bg-[#172a69] text-white" : "bg-[#f1f5f9] text-[#475569]"}`}>
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold text-[#111827]">{lesson.title}</span>
                      <span className="mt-1 block text-[11px] font-semibold text-[#7d8799]">
                        {lesson.duration_minutes ? `${lesson.duration_minutes} min` : "Lesson"}
                        {lesson.is_preview ? " • Preview" : !playable ? " • Locked" : ""}
                      </span>
                    </span>
                    {!playable ? <Lock className="mt-1 size-4 shrink-0 text-[#94a3b8]" /> : null}
                  </button>
                );
              })}
              {!lessons.length ? (
                <p className="px-2 py-4 text-sm font-semibold text-[#667085]">No lessons added yet.</p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </StudentDashboardShell>
  );
}
