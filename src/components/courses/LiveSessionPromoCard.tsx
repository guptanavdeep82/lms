import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { LiveClassActionButton } from "@/components/live-classes/LiveClassActionButton";
import { getCoursePromoTheme } from "@/lib/course-promo-theme";
import {
  formatLiveSessionSchedule,
  liveSessionStatusLabel,
  type LiveClassSessionItem,
} from "@/lib/live-classes";

type LiveSessionPromoCardProps = {
  session: LiveClassSessionItem;
  onAccessChange: () => void;
};

export function LiveSessionPromoCard({ session, onAccessChange }: LiveSessionPromoCardProps) {
  const theme = getCoursePromoTheme("live");
  const features = [
    session.faculty_name ? `Faculty: ${session.faculty_name}` : "Expert banking faculty",
    `${session.duration_minutes} min ${session.has_recording ? "recorded session" : "live session"}`,
    formatLiveSessionSchedule(session.scheduled_at),
    session.course.exam_type ? `Designed for ${session.course.exam_type}` : "Banking exam preparation",
  ];

  return (
    <article className="promo-course-card group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#1f2937] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.16)]">
      <Link href={`/live-classes/course/${session.course.slug}`} className="block">
        <div className="relative px-4 pb-5 pt-4 text-white" style={{ background: theme.gradient }}>
          {session.course.image_url ? (
            <div className="absolute inset-0 opacity-25">
              <img src={session.course.image_url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ background: theme.gradient, opacity: 0.82 }} />
            </div>
          ) : null}

          <div className="relative z-10">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Image src="/kr-logics-logo.png" alt="KR Logics" width={28} height={28} className="h-7 w-7 rounded-full border border-white/70 object-cover" />
                <Image src="/kr-logics-logo.png" alt="KR Logics" width={28} height={28} className="-ml-2 h-7 w-7 rounded-full border border-white/70 object-cover" />
              </div>
              <span className="rounded-md bg-[#f97316] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                {liveSessionStatusLabel(session.display_status)}
              </span>
            </div>

            <h3 className="text-[15px] font-extrabold leading-snug tracking-[-0.02em] text-white sm:text-[16px]">
              {session.title}
            </h3>

            <div
              className="mt-3 inline-block max-w-full rounded-md px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#111827]"
              style={{ background: theme.accent }}
            >
              {session.course.title}
            </div>
          </div>
        </div>
      </Link>

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
          <LiveClassActionButton
            session={session}
            onAccessChange={onAccessChange}
            className="flex h-11 w-full items-center justify-center rounded-full text-sm font-extrabold text-white transition hover:brightness-110"
            style={{ background: theme.button }}
          />
        </div>
      </div>
    </article>
  );
}
