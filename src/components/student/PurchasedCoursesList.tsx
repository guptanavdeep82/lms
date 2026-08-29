"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  ClipboardList,
  FileText,
  FolderOpen,
  Layers,
  Lock,
  PlayCircle,
  Radio,
  ShoppingCart,
  Video,
} from "lucide-react";
import {
  fetchStudentLibrary,
  formatInr,
  type StudentLibraryBreadcrumb,
  type StudentLibraryCourse,
  type StudentLibraryFolder,
  type StudentLibraryFolderMockTest,
  type StudentLibraryFolderPdf,
  type StudentLibraryFolderVideo,
} from "@/lib/packages";
import { getStudentSession } from "@/lib/student-auth";

const gradients = [
  "from-[#172a69] via-[#2350b8] to-[#13a38b]",
  "from-[#0f9f78] via-[#19b98a] to-[#f5c518]",
  "from-[#0538A1] via-[#0957D3] to-[#e8a800]",
  "from-[#ba7517] via-[#f0a500] to-[#ffcf33]",
];

function courseHasLiveAccess(course: StudentLibraryCourse) {
  return course.course_type === "live" || Boolean(course.has_live_classes);
}

function courseIsFolderBased(course: StudentLibraryCourse) {
  return course.course_folder_id != null;
}

function courseLearnHref(course: StudentLibraryCourse) {
  if (course.course_type === "pdf") {
    return `/courses/${course.slug}`;
  }

  return `/student/courses/${course.slug}/learn`;
}

function courseTypeLabel(course: StudentLibraryCourse) {
  if (course.course_type === "live" || course.has_live_classes) return "Live Class";
  if (course.course_type === "pdf") return "PDF Course";
  return "Video Course";
}

function courseIsLocked(course: StudentLibraryCourse) {
  return course.locked === true || course.has_access === false;
}

function courseDisplayPrice(course: StudentLibraryCourse) {
  if (course.sale_price != null && course.sale_price > 0) {
    return formatInr(course.sale_price);
  }
  if (course.price != null && course.price > 0) {
    return formatInr(course.price);
  }
  return null;
}

function courseMetaLine(course: StudentLibraryCourse) {
  if (courseHasLiveAccess(course)) {
    return `${course.live_sessions_count || 0} live session${(course.live_sessions_count || 0) === 1 ? "" : "s"}`;
  }
  if (courseIsFolderBased(course)) {
    const videos = course.folder_video_count || 0;
    const tests = course.mock_test_count || 0;
    const parts: string[] = [];
    if (videos > 0) parts.push(`${videos} video${videos === 1 ? "" : "s"}`);
    if (tests > 0) parts.push(`${tests} mock test${tests === 1 ? "" : "s"}`);
    return parts.length > 0 ? parts.join(" • ") : "Course content";
  }
  return `${course.lessons_count} lessons • ${course.duration_hours}+ hrs`;
}

// Falls back to a friendly label when the underlying media-library folder
// was left with a generic/blank name (e.g. "folder") by whoever uploaded it.
function friendlyFolderName(name: string, fallbackIndex = 0) {
  const trimmed = (name || "").trim();
  if (!trimmed || /^folder$/i.test(trimmed) || /^new folder/i.test(trimmed)) {
    return `Section ${fallbackIndex + 1}`;
  }
  return trimmed;
}

function CourseCardImage({
  course,
  index,
  badge,
  locked = false,
}: {
  course: StudentLibraryCourse;
  index: number;
  badge: string;
  locked?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${course.image_url ? "aspect-[16/10] bg-[#f8fafc]" : "min-h-[132px]"}`}>
      {course.image_url ? (
        <img
          src={course.image_url}
          alt={course.title}
          className={`h-full w-full object-cover object-center ${locked ? "opacity-60 grayscale" : ""}`}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} p-4 text-white ${locked ? "opacity-70" : ""}`}>
          <BookOpen className="absolute bottom-4 right-4 text-white/75" size={42} />
        </div>
      )}
      <span className="absolute left-4 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur">
        {badge}
      </span>
      {locked ? (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#111827]/px-2.5 py-1 text-[11px] font-extrabold text-white">
          <Lock size={12} /> Locked
        </span>
      ) : null}
    </div>
  );
}

function PurchasedCourseCard({
  course,
  index,
  onOpen,
}: {
  course: StudentLibraryCourse;
  index: number;
  onOpen: (course: StudentLibraryCourse) => void;
}) {
  const isLive = courseHasLiveAccess(course);
  const isFolderBased = courseIsFolderBased(course) && !isLive && course.course_type !== "pdf";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#e5eaf2] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <CourseCardImage course={course} index={index} badge={isLive ? "Live" : "Purchased"} />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7d8799]">{courseTypeLabel(course)}</p>
        <h3 className="mt-1 min-h-[44px] text-[15px] font-extrabold leading-snug text-[#111827]">{course.title}</h3>
        <p className="mt-1 text-xs font-semibold text-[#7d8799]">{courseMetaLine(course)}</p>

        {isFolderBased ? (
          <button
            type="button"
            onClick={() => onOpen(course)}
            className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#172a69] text-xs font-extrabold text-white transition hover:brightness-110"
          >
            Continue Learning <PlayCircle size={16} />
          </button>
        ) : (
          <Link
            href={isLive ? "/student/live-classes" : courseLearnHref(course)}
            className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-extrabold text-white transition hover:brightness-110 ${isLive ? "bg-[#0957D3]" : "bg-[#172a69]"}`}
          >
            {isLive ? (
              <>
                Join Live <Radio size={16} />
              </>
            ) : (
              <>
                Continue Learning <PlayCircle size={16} />
              </>
            )}
          </Link>
        )}
      </div>
    </article>
  );
}

type PurchasedCoursesListProps = {
  compact?: boolean;
};

export function PurchasedCoursesList({ compact = false }: PurchasedCoursesListProps) {
  const [courses, setCourses] = useState<StudentLibraryCourse[]>([]);
  const [folders, setFolders] = useState<StudentLibraryFolder[]>([]);
  const [folderCourses, setFolderCourses] = useState<StudentLibraryCourse[]>([]);
  const [folderVideos, setFolderVideos] = useState<StudentLibraryFolderVideo[]>([]);
  const [folderPdfs, setFolderPdfs] = useState<StudentLibraryFolderPdf[]>([]);
  const [folderMockTests, setFolderMockTests] = useState<StudentLibraryFolderMockTest[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<StudentLibraryBreadcrumb[]>([]);
  const [folderId, setFolderId] = useState<number | null>(null);
  const [scopedCourse, setScopedCourse] = useState<StudentLibraryCourse | null>(null);
  const [activeVideo, setActiveVideo] = useState<StudentLibraryFolderVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [browsing, setBrowsing] = useState(false);

  const loadLibrary = useCallback(async (nextFolderId: number | null, options?: { silent?: boolean }) => {
    const session = getStudentSession();
    if (!session?.email) {
      setLoading(false);
      return;
    }

    if (options?.silent) {
      setBrowsing(true);
    } else {
      setLoading(true);
    }
    setActiveVideo(null);
    const library = await fetchStudentLibrary(session.email, nextFolderId);
    setCourses(library?.courses || []);
    setFolders(library?.folders || []);
    setFolderCourses(library?.folder_courses || []);
    setFolderVideos(library?.folder_videos || []);
    setFolderPdfs(library?.folder_pdfs || []);
    setFolderMockTests(library?.folder_mock_tests || []);
    setBreadcrumb(library?.breadcrumb || []);
    setFolderId(library?.current_folder_id ?? nextFolderId);
    setLoading(false);
    setBrowsing(false);
  }, []);

  useEffect(() => {
    void loadLibrary(null);
  }, [loadLibrary]);

  const openCourse = useCallback(
    (course: StudentLibraryCourse) => {
      setScopedCourse(course);
      if (course.course_folder_id != null) {
        void loadLibrary(course.course_folder_id, { silent: true });
      }
    },
    [loadLibrary],
  );

  const backToMyCourses = useCallback(() => {
    setScopedCourse(null);
    setActiveVideo(null);
  }, []);

  // Breadcrumb trail for the currently opened course: swaps the raw (often
  // poorly named) root folder label for the actual course title, and hides
  // any media-library ancestors above the course's own access root.
  const scopedBreadcrumb = useMemo(() => {
    if (!scopedCourse) return [];
    const rootIndex = breadcrumb.findIndex((crumb) => crumb.id === scopedCourse.course_folder_id);
    const trail = rootIndex >= 0 ? breadcrumb.slice(rootIndex) : breadcrumb;
    return trail.map((crumb, idx) => ({
      ...crumb,
      name: idx === 0 ? scopedCourse.title : friendlyFolderName(crumb.name, idx),
    }));
  }, [breadcrumb, scopedCourse]);

  const visibleFolderCourses = useMemo(
    () => folderCourses.filter((course) => course.id !== scopedCourse?.id),
    [folderCourses, scopedCourse],
  );

  if (loading) {
    return <p className="text-sm font-semibold text-[#667085]">Loading purchased courses...</p>;
  }

  if (!courses.length) {
    return (
      <div className="rounded-[20px] border border-dashed border-[#dfe5ef] bg-[#f8fafc] p-8 text-center">
        <p className="text-sm font-bold text-[#667085]">No purchased courses yet.</p>
        <Link href="/courses" className="mt-4 inline-flex h-11 items-center rounded-2xl bg-[#172a69] px-5 text-sm font-extrabold text-white">
          Browse Courses
        </Link>
      </div>
    );
  }

  const visibleCourses = compact ? courses.slice(0, 3) : courses;

  if (compact) {
    return (
      <div className="grid gap-5 lg:grid-cols-3">
        {visibleCourses.map((course, index) => (
          <PurchasedCourseCard key={course.id} course={course} index={index} onOpen={openCourse} />
        ))}
      </div>
    );
  }

  // Default landing: a clear grid of every purchased course by name/thumbnail,
  // so students immediately know exactly what they bought.
  if (!scopedCourse) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course, index) => (
          <PurchasedCourseCard key={course.id} course={course} index={index} onOpen={openCourse} />
        ))}
      </div>
    );
  }

  const hasBrowseItems = folders.length > 0 || visibleFolderCourses.length > 0 || folderVideos.length > 0 || folderPdfs.length > 0 || folderMockTests.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-[20px] border border-[#dfe5ef] bg-[#f8fafc] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={backToMyCourses}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#172a69] shadow-sm ring-1 ring-[#dfe5ef] transition hover:bg-[#eef2ff]"
            aria-label="Back to My Courses"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7d8799]">Now viewing</p>
            <h2 className="truncate text-[17px] font-extrabold tracking-[-0.03em] text-[#172a69]">{scopedCourse.title}</h2>
          </div>
        </div>
        <button
          type="button"
          onClick={backToMyCourses}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-white px-3 text-xs font-extrabold text-[#172a69] shadow-sm ring-1 ring-[#dfe5ef] transition hover:bg-[#eef2ff]"
        >
          <ArrowLeft size={14} /> My Courses
        </button>
      </div>

      {scopedBreadcrumb.length > 1 ? (
        <nav className="flex flex-wrap items-center gap-1 text-sm font-bold text-[#667085]">
          {scopedBreadcrumb.map((crumb, idx) => (
            <span key={crumb.id} className="inline-flex items-center gap-1">
              {idx > 0 ? <ChevronRight size={14} className="text-[#c0c7d4]" /> : null}
              <button
                type="button"
                onClick={() => void loadLibrary(crumb.id, { silent: true })}
                className={`rounded-lg px-2 py-1 transition hover:bg-[#eef2ff] hover:text-[#172a69] ${folderId === crumb.id ? "bg-[#eef2ff] text-[#172a69]" : ""}`}
              >
                {crumb.name}
              </button>
            </span>
          ))}
        </nav>
      ) : null}

      {activeVideo?.video_url ? (
        <div className="overflow-hidden rounded-[22px] border border-[#dfe5ef] bg-black shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-3 bg-[#111827] px-4 py-3">
            <p className="truncate text-sm font-extrabold text-white">{activeVideo.title}</p>
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20"
            >
              Close
            </button>
          </div>
          <div className="aspect-video w-full">
            <video src={activeVideo.video_url} controls autoPlay className="h-full w-full bg-black object-contain" />
          </div>
        </div>
      ) : null}

      {browsing ? (
        <p className="text-sm font-semibold text-[#667085]">Loading...</p>
      ) : !hasBrowseItems ? (
        <div className="rounded-[20px] border border-dashed border-[#dfe5ef] bg-[#f8fafc] p-8 text-center">
          <p className="text-sm font-bold text-[#667085]">No content has been added to this course yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {folders.map((folder, index) => (
            <button
              key={`folder-${folder.id}`}
              type="button"
              onClick={() => void loadLibrary(folder.id, { silent: true })}
              className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#dfe5ef] bg-white p-5 text-left shadow-[0_12px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#172a69]">
                <Layers size={22} />
              </div>
              <h2 className="mt-4 text-[17px] font-extrabold tracking-[-0.03em] text-[#172a69]">
                {friendlyFolderName(folder.name, index)}
              </h2>
              <p className="mt-1 text-sm font-semibold text-[#7d8799]">
                {folder.subfolder_count > 0 ? `${folder.subfolder_count} section${folder.subfolder_count === 1 ? "" : "s"}` : "No sub-sections"}
                {(folder.video_count || 0) > 0 ? ` · ${folder.video_count} video${folder.video_count === 1 ? "" : "s"}` : ""}
                {(folder.pdf_count || 0) > 0 ? ` · ${folder.pdf_count} PDF${folder.pdf_count === 1 ? "" : "s"}` : ""}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-extrabold text-[#0957D3]">
                Open <ChevronRight size={14} />
              </span>
            </button>
          ))}

          {folderVideos.map((video) => (
            <article
              key={`video-${video.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#dfe5ef] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="relative flex min-h-[132px] items-center justify-center bg-gradient-to-br from-[#172a69] via-[#2350b8] to-[#13a38b]">
                <Video className="text-white/80" size={42} />
                <span className="absolute left-4 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur">
                  Lesson
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-[17px] font-extrabold tracking-[-0.03em] text-[#172a69]">{video.title}</h2>
                <p className="mt-1 text-sm font-semibold text-[#7d8799]">{video.size_label || "Video lesson"}</p>
                <button
                  type="button"
                  disabled={!video.video_url}
                  onClick={() => setActiveVideo(video)}
                  className="mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#172a69] px-3 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Play <PlayCircle size={16} />
                </button>
              </div>
            </article>
          ))}

          {folderPdfs.map((pdf) => (
            <article
              key={`pdf-${pdf.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#dfe5ef] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="relative flex min-h-[132px] items-center justify-center bg-gradient-to-br from-[#ba7517] via-[#f0a500] to-[#ffcf33]">
                <FileText className="text-white/90" size={42} />
                <span className="absolute left-4 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur">
                  PDF
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-[17px] font-extrabold tracking-[-0.03em] text-[#172a69]">{pdf.title}</h2>
                <p className="mt-1 text-sm font-semibold text-[#7d8799]">{pdf.size_label || "PDF notes"}</p>
                {pdf.url ? (
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#172a69] px-3 text-xs font-extrabold text-white"
                  >
                    Open PDF <FileText size={16} />
                  </a>
                ) : (
                  <span className="mt-auto inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#eef2f7] text-xs font-extrabold text-[#94a3b8]">
                    Unavailable
                  </span>
                )}
              </div>
            </article>
          ))}

          {folderMockTests.map((test) => (
            <article
              key={`mock-${test.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#dfe5ef] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="relative flex min-h-[132px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#0538A1] via-[#0957D3] to-[#13a38b]">
                {test.image_url ? (
                  <img src={test.image_url} alt={test.title} className="h-full w-full object-cover" />
                ) : (
                  <ClipboardList className="text-white/85" size={42} />
                )}
                <span className="absolute left-4 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur">
                  Mock Test
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-[17px] font-extrabold tracking-[-0.03em] text-[#172a69]">{test.title}</h2>
                <p className="mt-1 text-sm font-semibold text-[#7d8799]">
                  {test.duration_minutes ? `${test.duration_minutes} min` : "Mock test"}
                  {test.questions_count > 0 ? ` · ${test.questions_count} question${test.questions_count === 1 ? "" : "s"}` : ""}
                </p>
                <Link
                  href={`/student/mock-tests/${test.slug}/instructions`}
                  className="mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#172a69] px-3 text-xs font-extrabold text-white"
                >
                  Start Test <PlayCircle size={16} />
                </Link>
              </div>
            </article>
          ))}

          {visibleFolderCourses.map((course, index) => {
            const locked = courseIsLocked(course);
            const isLive = courseHasLiveAccess(course);
            const priceLabel = courseDisplayPrice(course);

            return (
              <article
                key={`course-${course.id}`}
                className={`group flex h-full flex-col overflow-hidden rounded-[22px] border bg-white shadow-[0_12px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] ${locked ? "border-[#e8e0d0]" : "border-[#dfe5ef]"}`}
              >
                <CourseCardImage
                  course={course}
                  index={index}
                  badge={locked ? "Locked" : isLive ? "Live Class" : "Active"}
                  locked={locked}
                />
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7d8799]">{courseTypeLabel(course)}</p>
                      <h2 className="mt-1 text-[17px] font-extrabold tracking-[-0.03em] text-[#172a69]">{course.title}</h2>
                      <p className="mt-1 text-sm font-semibold text-[#7d8799]">
                        {locked
                          ? "Purchase to unlock this course"
                          : course.short_description || "Also included in this course"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${locked ? "bg-[#fff4e5] text-[#9a6700]" : "bg-[#e9f9f3] text-[#0f9f78]"}`}
                    >
                      {locked ? priceLabel || "Buy" : `${course.duration_hours}+ hrs`}
                    </span>
                  </div>
                  <div className="mt-auto flex gap-2 pt-4">
                    {locked ? (
                      <Link
                        href={`/courses/${course.slug}`}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#172a69] px-3 text-xs font-extrabold text-white"
                      >
                        Buy Course <ShoppingCart size={16} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openCourse(course)}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#172a69] px-3 text-xs font-extrabold text-white"
                      >
                        Open <FolderOpen size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PurchasedCoursesStats() {
  const [count, setCount] = useState("0");

  useEffect(() => {
    const session = getStudentSession();
    if (!session?.email) return;
    fetchStudentLibrary(session.email).then((library) => {
      setCount(String(library?.stats.courses_count ?? 0));
    });
  }, []);

  return <>{count}</>;
}
