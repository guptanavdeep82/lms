"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Award, BookOpen, PlayCircle } from "lucide-react";
import { fetchStudentLibrary, type StudentLibraryCourse } from "@/lib/packages";
import { getStudentSession } from "@/lib/student-auth";

const gradients = [
  "from-[#172a69] via-[#2350b8] to-[#13a38b]",
  "from-[#0f9f78] via-[#19b98a] to-[#f5c518]",
  "from-[#243580] via-[#6d5dfc] to-[#e8a800]",
  "from-[#ba7517] via-[#f0a500] to-[#ffcf33]",
];

function courseLearnHref(course: StudentLibraryCourse) {
  if (course.course_type === "pdf") {
    return `/courses/${course.slug}`;
  }

  return `/student/courses/${course.slug}/learn`;
}

function CourseCardImage({
  course,
  index,
  badge,
}: {
  course: StudentLibraryCourse;
  index: number;
  badge: string;
}) {
  return (
    <div className={`relative overflow-hidden ${course.image_url ? "aspect-[16/10] bg-[#f8fafc]" : "min-h-[132px]"}`}>
      {course.image_url ? (
        <img
          src={course.image_url}
          alt={course.title}
          className="h-full w-full object-cover object-center"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} p-4 text-white`}>
          <BookOpen className="absolute bottom-4 right-4 text-white/75" size={42} />
        </div>
      )}
      <span className="absolute left-4 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur">
        {badge}
      </span>
    </div>
  );
}

type PurchasedCoursesListProps = {
  compact?: boolean;
};

export function PurchasedCoursesList({ compact = false }: PurchasedCoursesListProps) {
  const [courses, setCourses] = useState<StudentLibraryCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStudentSession();
    if (!session?.email) {
      setLoading(false);
      return;
    }

    fetchStudentLibrary(session.email)
      .then((library) => setCourses(library?.courses || []))
      .finally(() => setLoading(false));
  }, []);

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
          <article key={course.id} className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#e5eaf2] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <CourseCardImage course={course} index={index} badge="Purchased" />
            <div className="flex flex-1 flex-col p-5">
              <h3 className="min-h-[44px] text-[15px] font-extrabold leading-snug text-[#111827]">{course.title}</h3>
              <p className="mt-1 text-xs font-semibold text-[#7d8799]">{course.lessons_count} lessons • {course.duration_hours}+ hrs</p>
              <Link href={courseLearnHref(course)} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#172a69] text-xs font-extrabold text-white">
                Continue <PlayCircle size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {visibleCourses.map((course, index) => (
        <article key={course.id} className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#dfe5ef] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <CourseCardImage course={course} index={index} badge="Active" />
          <div className="flex flex-1 flex-col p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7d8799]">{course.course_type}</p>
                <h2 className="mt-1 text-[17px] font-extrabold tracking-[-0.03em] text-[#172a69]">{course.title}</h2>
                <p className="mt-1 text-sm font-semibold text-[#7d8799]">{course.short_description || "Purchased course access"}</p>
              </div>
              <span className="rounded-full bg-[#e9f9f3] px-3 py-1 text-[11px] font-extrabold text-[#0f9f78]">{course.duration_hours}+ hrs</span>
            </div>
            <p className="mt-3 text-xs font-semibold text-[#7d8799]">{course.lessons_count} lessons included</p>
            <div className="mt-auto flex gap-2 pt-4">
              <Link href={courseLearnHref(course)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#172a69] px-3 text-xs font-extrabold text-white">
                Continue <PlayCircle size={16} />
              </Link>
              <button type="button" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#fff8dc] px-3 text-xs font-extrabold text-[#8a6100]">
                Certificate <Award size={16} />
              </button>
            </div>
          </div>
        </article>
      ))}
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
