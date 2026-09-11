"use client";

import Link from "next/link";
import { Bookmark, BookOpen, FileText, Loader2, Newspaper, Trash2, WalletCards } from "lucide-react";
import { StudentSectionCard } from "@/components/student/StudentSectionCard";
import { useBookmarks } from "@/components/student/BookmarksProvider";
import type { StudentBookmarkType } from "@/lib/student-dashboard";

const typeMeta: Record<StudentBookmarkType, { label: string; icon: typeof Bookmark; tone: string }> = {
  course: { label: "Course", icon: BookOpen, tone: "bg-[#eef2ff] text-[#172a69]" },
  mock_test: { label: "Mock Test", icon: WalletCards, tone: "bg-[#ecfdf3] text-[#027a48]" },
  current_affair: { label: "Current Affairs", icon: Newspaper, tone: "bg-[#fff7ed] text-[#c2410c]" },
  mock_question: { label: "Question", icon: FileText, tone: "bg-[#f4f3ff] text-[#5925dc]" },
};

export function StudentBookmarksPanel({ compact = false }: { compact?: boolean }) {
  const { bookmarks, loading, removeBookmark } = useBookmarks();
  const visible = compact ? bookmarks.slice(0, 4) : bookmarks;

  if (loading) {
    return (
      <div className="grid min-h-[24vh] place-items-center">
        <Loader2 className="animate-spin text-[#172a69]" size={28} />
      </div>
    );
  }

  return (
    <StudentSectionCard eyebrow="Saved" title={compact ? "Recent bookmarks" : "All bookmarks"}>
      {visible.length ? (
        <div className={compact ? "grid gap-3" : "grid gap-4 md:grid-cols-2"}>
          {visible.map((item) => {
            const meta = typeMeta[item.type] ?? typeMeta.course;
            const Icon = meta.icon;
            return (
              <article key={item.id} className="flex items-start gap-3 rounded-[20px] border border-[#e5eaf2] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${meta.tone}`}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#7d8799]">{meta.label}</p>
                  <Link href={item.url || "/student/bookmarks"} className="mt-1 block text-sm font-extrabold leading-snug text-[#172a69] hover:underline">
                    {item.title}
                  </Link>
                  {item.excerpt ? <p className="mt-1 line-clamp-2 text-xs font-medium text-[#667085]">{item.excerpt}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => void removeBookmark(item.id)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#dfe5ef] bg-[#fff5f5] text-[#c53030]"
                  aria-label="Remove bookmark"
                >
                  <Trash2 size={14} />
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[20px] border border-dashed border-[#dfe5ef] bg-[#f8fafc] p-8 text-center">
          <Bookmark size={30} className="mx-auto text-[#c7d2e5]" />
          <p className="mt-3 text-sm font-bold text-[#667085]">No bookmarks yet. Save courses, mock tests or current affairs to see them here.</p>
        </div>
      )}
      {compact && bookmarks.length > 4 ? (
        <Link href="/student/bookmarks" className="mt-4 inline-flex text-sm font-bold text-[#0957D3] hover:underline">
          View all bookmarks
        </Link>
      ) : null}
    </StudentSectionCard>
  );
}
