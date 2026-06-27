"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardCheck } from "lucide-react";
import { fetchCourses, type ApiCourse } from "@/lib/courses";
import { mockTestsApiUrl, type MockTest, type MockTestsResponse } from "@/lib/mock-tests";

type SearchItem =
  | { kind: "course"; id: number; title: string; subtitle: string; href: string }
  | { kind: "mock"; id: number; title: string; subtitle: string; href: string };

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetchCourses(),
      fetch(mockTestsApiUrl())
        .then((response) => (response.ok ? response.json() : { categories: [] }))
        .then((payload: MockTestsResponse) =>
          (payload.categories ?? []).flatMap((category) =>
            (category.tests ?? []).map((test) => ({
              ...test,
              category: test.category ?? category.name,
              category_slug: test.category_slug ?? category.slug,
            })),
          ),
        )
        .catch(() => [] as MockTest[]),
    ]).then(([courseItems, mockItems]) => {
      if (!mounted) return;
      setCourses(courseItems);
      setMockTests(mockItems);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return { courses: [] as SearchItem[], mocks: [] as SearchItem[] };

    const courseResults: SearchItem[] = courses
      .filter((course) =>
        [course.title, course.short_description, course.category, course.exam_type]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term)),
      )
      .slice(0, 6)
      .map((course) => ({
        kind: "course" as const,
        id: course.id,
        title: course.title,
        subtitle: course.category || course.course_type || "Course",
        href: `/courses/${course.slug}`,
      }));

    const mockResults: SearchItem[] = mockTests
      .filter((test) =>
        [test.title, test.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term)),
      )
      .slice(0, 6)
      .map((test) => ({
        kind: "mock" as const,
        id: test.id,
        title: test.title,
        subtitle: test.category || "Mock Test",
        href: `/mock-tests/${test.category_slug ?? ""}`,
      }));

    return { courses: courseResults, mocks: mockResults };
  }, [courses, mockTests, query]);

  const hasResults = results.courses.length > 0 || results.mocks.length > 0;
  const showPanel = open && query.trim().length >= 2;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const first = results.courses[0] ?? results.mocks[0];
    if (first) {
      window.location.href = first.href;
      return;
    }
    if (query.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <div className="header-search-wrap" ref={wrapRef}>
      <form className="header-search" onSubmit={handleSubmit} role="search">
        <svg
          className="header-search-ic"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          name="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search courses, mock tests & exams..."
          aria-label="Search courses and mock tests"
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>

      {showPanel ? (
        <div className="header-search-panel">
          {!hasResults ? (
            <p className="header-search-empty">No courses or mock tests found for &quot;{query.trim()}&quot;.</p>
          ) : (
            <>
              {results.courses.length > 0 ? (
                <div className="header-search-group">
                  <p className="header-search-label">Courses</p>
                  {results.courses.map((item) => (
                    <Link
                      key={`course-${item.id}`}
                      href={item.href}
                      className="header-search-item"
                      onClick={() => setOpen(false)}
                    >
                      <span className="header-search-item-ic course">
                        <BookOpen size={15} />
                      </span>
                      <span className="header-search-item-meta">
                        <strong>{item.title}</strong>
                        <small>{item.subtitle}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}

              {results.mocks.length > 0 ? (
                <div className="header-search-group">
                  <p className="header-search-label">Mock Tests</p>
                  {results.mocks.map((item) => (
                    <Link
                      key={`mock-${item.id}`}
                      href={item.href}
                      className="header-search-item"
                      onClick={() => setOpen(false)}
                    >
                      <span className="header-search-item-ic mock">
                        <ClipboardCheck size={15} />
                      </span>
                      <span className="header-search-item-meta">
                        <strong>{item.title}</strong>
                        <small>{item.subtitle}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
