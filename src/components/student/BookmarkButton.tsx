"use client";

import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useBookmarks } from "@/components/student/BookmarksProvider";
import type { StudentBookmarkType } from "@/lib/student-dashboard";

export function BookmarkButton({
  type,
  id,
  title,
  url,
  excerpt,
  className = "",
  iconOnly = false,
}: {
  type: StudentBookmarkType;
  id: number;
  title: string;
  url?: string;
  excerpt?: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [saving, setSaving] = useState(false);
  const saved = isBookmarked(type, id);

  return (
    <button
      type="button"
      onClick={async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (saving) return;
        setSaving(true);
        try {
          await toggleBookmark({ type, id, title, url, excerpt });
        } finally {
          setSaving(false);
        }
      }}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-extrabold transition ${
        saved
          ? "border-[#f5c518] bg-[#fff8dc] text-[#172a69]"
          : "border-[#dfe5ef] bg-white text-[#475569] hover:border-[#c7d2fe] hover:text-[#172a69]"
      } ${className}`}
      aria-label={saved ? "Remove bookmark" : "Add bookmark"}
      title={saved ? "Remove bookmark" : "Save to bookmarks"}
    >
      {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      {iconOnly ? null : saved ? "Saved" : "Bookmark"}
    </button>
  );
}
