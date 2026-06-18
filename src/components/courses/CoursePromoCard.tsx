import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  buildCoursePromoFeatures,
  coursePromoPriceLabel,
  getCoursePromoTheme,
} from "@/lib/course-promo-theme";
import type { ListingCourse } from "@/lib/courses";

type CoursePromoCardProps = {
  course: ListingCourse;
  href?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function CoursePromoCard({ course, href, actionLabel, onAction }: CoursePromoCardProps) {
  const theme = getCoursePromoTheme(course.type);
  const features = buildCoursePromoFeatures(course);
  const priceLabel = coursePromoPriceLabel(course.price, course.original);
  const targetHref = href || `/courses/${course.slug}`;
  const buttonText = actionLabel || (course.price === 0 ? "Enroll Free" : "Buy Now");

  return (
    <article className="promo-course-card group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#1f2937] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.16)]">
      <div className={`relative overflow-hidden text-white ${course.image_url ? "aspect-[16/10] bg-[#050808]" : "min-h-[168px]"}`}>
        {course.image_url ? (
          <>
            <img
              src={course.image_url}
              alt={course.title}
              className="absolute inset-0 h-full w-full object-contain object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050808]/90 via-transparent to-[#050808]/20" />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: theme.gradient }} />
        )}

        <div className="relative z-10 px-4 pb-5 pt-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Image src="/logics-logo.jpeg" alt="KR Logics" width={28} height={28} className="h-7 w-7 rounded-full border border-white/70 object-cover shadow-sm" />
            </div>
            <span className="rounded-md bg-[#f97316] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
              {course.badge || theme.statusLabel}
            </span>
          </div>

          <h3 className="text-[15px] font-extrabold leading-snug tracking-[-0.02em] text-white drop-shadow sm:text-[16px]">
            {course.title}
          </h3>

          <div
            className="mt-3 inline-block max-w-full rounded-md px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#111827] shadow-sm"
            style={{ background: theme.accent }}
          >
            {theme.subtitle}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-[12px] font-semibold leading-5 text-[#374151]">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#111827] text-white">
                <ChevronRight size={12} strokeWidth={3} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          {course.original > course.price && course.price > 0 ? (
            <p className="mb-2 text-center text-xs font-bold text-[#9ca3af] line-through">
              ₹{course.original.toLocaleString("en-IN")}
            </p>
          ) : null}
          {onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="flex h-11 w-full items-center justify-center rounded-full text-sm font-extrabold text-white transition hover:brightness-110"
              style={{ background: theme.button }}
            >
              {buttonText} · {priceLabel}
            </button>
          ) : (
            <Link
              href={targetHref}
              className="flex h-11 w-full items-center justify-center rounded-full text-sm font-extrabold text-white transition hover:brightness-110"
              style={{ background: theme.button }}
            >
              {buttonText} · {priceLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
