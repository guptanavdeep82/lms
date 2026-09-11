"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  createStudentBookmark,
  deleteStudentBookmark,
  fetchStudentBookmarks,
  type StudentBookmarkRecord,
  type StudentBookmarkType,
} from "@/lib/student-dashboard";
import { useStudentEmail } from "@/components/student/useStudentEmail";

type BookmarkInput = {
  type: StudentBookmarkType;
  id: number;
  title: string;
  url?: string;
  excerpt?: string;
};

type BookmarksContextValue = {
  bookmarks: StudentBookmarkRecord[];
  loading: boolean;
  isBookmarked: (type: StudentBookmarkType, id: number) => boolean;
  toggleBookmark: (input: BookmarkInput) => Promise<void>;
  removeBookmark: (id: number) => Promise<void>;
};

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const email = useStudentEmail();
  const [bookmarks, setBookmarks] = useState<StudentBookmarkRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    fetchStudentBookmarks(email)
      .then(setBookmarks)
      .finally(() => setLoading(false));
  }, [email]);

  const isBookmarked = useCallback(
    (type: StudentBookmarkType, id: number) =>
      bookmarks.some((item) => item.type === type && Number(item.bookmarkable_id) === id),
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    async (input: BookmarkInput) => {
      if (!email) return;
      const existing = bookmarks.find(
        (item) => item.type === input.type && Number(item.bookmarkable_id) === input.id,
      );

      if (existing) {
        await deleteStudentBookmark(email, existing.id);
        setBookmarks((current) => current.filter((item) => item.id !== existing.id));
        return;
      }

      const created = await createStudentBookmark({
        email,
        type: input.type,
        id: input.id,
        title: input.title,
        url: input.url,
        excerpt: input.excerpt,
      });
      if (created) {
        setBookmarks((current) => [created, ...current.filter((item) => item.id !== created.id)]);
      }
    },
    [bookmarks, email],
  );

  const removeBookmark = useCallback(
    async (id: number) => {
      if (!email) return;
      await deleteStudentBookmark(email, id);
      setBookmarks((current) => current.filter((item) => item.id !== id));
    },
    [email],
  );

  const value = useMemo(
    () => ({ bookmarks, loading, isBookmarked, toggleBookmark, removeBookmark }),
    [bookmarks, isBookmarked, loading, removeBookmark, toggleBookmark],
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used inside BookmarksProvider");
  }
  return context;
}
