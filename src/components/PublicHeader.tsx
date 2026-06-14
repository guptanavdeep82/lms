"use client";

import { type MouseEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { mockTestsApiUrl, type MockCategory, type MockTest, type MockTestsResponse } from "@/lib/mock-tests";
import { cmsPageHref, fetchCmsPages, type CmsPageSummary } from "@/lib/cms-pages";
import { getStudentSession, logoutStudent } from "@/lib/student-auth";

const fallbackCategories: MockCategory[] = [
  {
    id: 0,
    name: "Banking & Insurance",
    slug: "banking-exams",
    description: null,
    image_url: null,
    tests: [
      fallbackTest("SBI PO", "sbi-po"),
      fallbackTest("IBPS PO", "ibps-po"),
      fallbackTest("IBPS Clerk", "ibps-clerk"),
      fallbackTest("SBI Clerk", "sbi-clerk"),
    ],
  },
];

type PublicHeaderProps = {
  active?: "home" | "courses" | "packages" | "mock-tests" | "faculty" | "contact" | "live-classes";
};

export function PublicHeader({ active }: PublicHeaderProps) {
  const [mockCategories, setMockCategories] = useState<MockCategory[]>(fallbackCategories);
  const [activeCategorySlug, setActiveCategorySlug] = useState(fallbackCategories[0].slug);
  const [isLoggedIn, setIsLoggedIn] = useState(() => (typeof window === "undefined" ? false : Boolean(getStudentSession())));
  const [openMenu, setOpenMenu] = useState<"courses" | "exams" | "latest-exam" | null>(null);
  const [cmsPages, setCmsPages] = useState<CmsPageSummary[]>([]);

  useEffect(() => {
    let mounted = true;

    fetch(mockTestsApiUrl())
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load mock tests");
        return response.json();
      })
      .then((payload: MockTestsResponse) => {
        if (!mounted) return;
        const categories = payload.categories ?? [];

        if (categories.length) {
          setMockCategories(categories);
          setActiveCategorySlug((current) => (categories.some((category) => category.slug === current) ? current : categories[0].slug));
        }
      })
      .catch(() => {
        if (!mounted) return;
        setMockCategories(fallbackCategories);
        setActiveCategorySlug(fallbackCategories[0].slug);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    fetchCmsPages().then((pages) => {
      if (mounted) setCmsPages(pages);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const syncSession = () => setIsLoggedIn(Boolean(getStudentSession()));
    window.addEventListener("storage", syncSession);
    window.addEventListener("focus", syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("focus", syncSession);
    };
  }, []);

  const activeCategory = useMemo(() => {
    return mockCategories.find((category) => category.slug === activeCategorySlug) ?? mockCategories[0] ?? null;
  }, [activeCategorySlug, mockCategories]);

  const activeTests = activeCategory?.tests ?? [];
  const registerHref = getRegisterHref();

  const handleLogout = () => {
    logoutStudent();
    setIsLoggedIn(false);
  };

  const handleMobileMenuClick = (event: MouseEvent<HTMLAnchorElement>, menu: "courses" | "exams" | "latest-exam") => {
    if (typeof window === "undefined" || window.innerWidth > 900) return;
    event.preventDefault();
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const navLink = (href: string, label: string, key?: PublicHeaderProps["active"]) => (
    <Link href={href} className={key && active === key ? "active" : ""}>
      {label}
    </Link>
  );

  return (
      <header className="public-home-header">
        <div className="header-inner">
          <Link href="/" className="logo-wrap">
            <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="19" r="16" stroke="#F5C518" strokeWidth="2.5" fill="none" />
              <text x="19" y="27" fontFamily="Sora,sans-serif" fontWeight="800" fontSize="15" fill="#1B2E6B">K</text>
              <text x="28" y="25" fontFamily="Sora,sans-serif" fontWeight="800" fontSize="15" fill="#E8A800">R</text>
              <rect x="9" y="33" width="9" height="2" rx="1" fill="#1B2E6B" />
              <rect x="30" y="33" width="9" height="2" rx="1" fill="#1B2E6B" />
              <line x1="24" y1="33" x2="24" y2="46" stroke="#E8A800" strokeWidth="1.8" />
              <rect x="20" y="42" width="8" height="3" rx=".5" fill="#E8A800" />
            </svg>
            <div className="logo-text-group">
              <div className="brand">KR <span>Logics</span></div>
              <div className="tagline">IBPS · SBI · RBI · Insurance</div>
            </div>
          </Link>

          <nav>
            <a href="https://krlogicsblog.com/" target="_blank" rel="noopener noreferrer">Blog</a>
            <div className="course-menu-wrap">
              <Link href="/courses" onClick={(event) => handleMobileMenuClick(event, "courses")} className={`exam-menu-trigger ${active === "courses" || active === "live-classes" ? "active" : ""}`}>Courses <span className="chev">⌄</span></Link>
              <div className={`course-dropdown ${openMenu === "courses" ? "open" : ""}`}>
                <Link href="/courses?type=video"><span>▶</span> Video Courses</Link>
                <Link href="/courses?type=pdf"><span>PDF</span> PDF Courses</Link>
                <Link href="/live-classes"><span>LIVE</span> Live Classes</Link>
              </div>
            </div>
            {navLink("/packages", "Packages", "packages")}
            <div className="exam-menu-wrap latest-exam-wrap">
              <Link href={cmsPages[0] ? cmsPageHref(cmsPages[0].slug) : "#"} onClick={(event) => handleMobileMenuClick(event, "latest-exam")} className="exam-menu-trigger">Latest Exam <span className="chev">⌄</span></Link>
              <div className={`exam-mega latest-exam-mega ${openMenu === "latest-exam" ? "open" : ""}`}>
                <div className="exam-grid">
                  {cmsPages.map((page, index) => (
                    <Link key={page.id} href={cmsPageHref(page.slug)} className="exam-link">
                      <span className={`exam-icon ${examTone(index)}`}>{initials(page.title)}</span>
                      {page.title}
                    </Link>
                  ))}
                  {!cmsPages.length && <div className="exam-empty">No exam pages available yet.</div>}
                </div>
              </div>
            </div>
            <div className="exam-menu-wrap">
              <Link href="/mock-tests" onClick={(event) => handleMobileMenuClick(event, "exams")} className="exam-menu-trigger">Exams <span className="chev">⌄</span></Link>
              <div className={`exam-mega ${openMenu === "exams" ? "open" : ""}`}>
                <div className="exam-cats">
                  {mockCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/mock-tests/${category.slug}`}
                      className={`exam-cat ${category.slug === activeCategory?.slug ? "active" : ""}`}
                      onMouseEnter={() => setActiveCategorySlug(category.slug)}
                      onFocus={() => setActiveCategorySlug(category.slug)}
                    >
                      {category.name} <span>›</span>
                    </Link>
                  ))}
                </div>
                <div className="exam-grid">
                  {displayTests(activeTests).map(({ test, title }, index) => (
                    <Link key={test.slug} href={`/mock-tests/${test.category_slug ?? activeCategory?.slug ?? ""}`} className="exam-link">
                      <span className={`exam-icon ${examTone(index)}`}>{initials(test.title)}</span>
                      {title}
                    </Link>
                  ))}
                  {!activeTests.length && <div className="exam-empty">No mock tests available in this category.</div>}
                </div>
              </div>
            </div>
            {navLink("/mock-tests", "Mock Tests", "mock-tests")}
            {navLink("/faculty", "Faculty", "faculty")}
            {navLink("/contact", "Contact", "contact")}
          </nav>

          <div className="hdr-btns">
            {isLoggedIn ? (
              <button type="button" onClick={handleLogout} className="btn-ghost">Logout</button>
            ) : (
              <>
                <Link href="/login" className="btn-ghost">Login</Link>
                <Link href={registerHref} className="btn-primary">Enroll Free →</Link>
              </>
            )}
          </div>
        </div>
      </header>
  );
}

function fallbackTest(title: string, slug: string): MockTest {
  return {
    id: Math.abs(slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)),
    title,
    slug,
    category: "Banking & Insurance",
    category_slug: "banking-exams",
    image_url: null,
    test_type: "full_length",
    is_locked: false,
    duration_minutes: 60,
    total_marks: 100,
    price: null,
    sale_price: null,
    instructions: null,
    status: "published",
    questions_count: 0,
  };
}

function getRegisterHref() {
  if (typeof window === "undefined") {
    return "/register";
  }

  const redirect = new URLSearchParams(window.location.search).get("redirect");
  return redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register";
}

function cleanTestTitle(title: string) {
  return title
    .replace(/\s+Mock\s+Test\s*-\s*\d+$/i, "")
    .replace(/\s+Mock\s*-\s*\d+$/i, "")
    .trim();
}

function displayTests(tests: MockTest[]) {
  const baseTitles = tests.map((test) => cleanTestTitle(test.title));
  const totals = baseTitles.reduce<Record<string, number>>((count, title) => {
    count[title] = (count[title] ?? 0) + 1;
    return count;
  }, {});
  const seen: Record<string, number> = {};

  return tests.map((test, index) => {
    const baseTitle = baseTitles[index];
    seen[baseTitle] = (seen[baseTitle] ?? 0) + 1;

    return {
      test,
      title: totals[baseTitle] > 1 ? `${baseTitle} - ${seen[baseTitle]}` : baseTitle,
    };
  });
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function examTone(index: number) {
  return ["sky", "blue", "gold", "gray", "purple", "red", "soft"][index % 7];
}
