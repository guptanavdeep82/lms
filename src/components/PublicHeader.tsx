"use client";

import { type MouseEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { mockTestsApiUrl, type MockCategory, type MockTest, type MockTestsResponse } from "@/lib/mock-tests";
import { cmsPageHref, fetchCmsPages, type CmsPageSummary } from "@/lib/cms-pages";
import { BRAND_LOGO_ALT, BRAND_LOGO_HEADER_SRC } from "@/lib/brand";
import { HeaderSearch } from "@/components/HeaderSearch";
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

type MenuKey = "courses" | "exams" | "latest-exam";

export function PublicHeader({ active }: PublicHeaderProps) {
  const [mockCategories, setMockCategories] = useState<MockCategory[]>(fallbackCategories);
  const [activeCategorySlug, setActiveCategorySlug] = useState(fallbackCategories[0].slug);
  const [isLoggedIn, setIsLoggedIn] = useState(() => (typeof window === "undefined" ? false : Boolean(getStudentSession())));
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const activeCategory = useMemo(() => {
    return mockCategories.find((category) => category.slug === activeCategorySlug) ?? mockCategories[0] ?? null;
  }, [activeCategorySlug, mockCategories]);

  const activeTests = activeCategory?.tests ?? [];
  const registerHref = getRegisterHref();

  const handleLogout = () => {
    logoutStudent();
    setIsLoggedIn(false);
    setMobileNavOpen(false);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
    setOpenMenu(null);
  };

  const toggleSubmenu = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>, menu: MenuKey) => {
    if (typeof window !== "undefined" && window.innerWidth > 900) return;
    event.preventDefault();
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const navLink = (href: string, label: string, key?: PublicHeaderProps["active"]) => (
    <Link href={href} className={key && active === key ? "active" : ""} onClick={closeMobileNav}>
      {label}
    </Link>
  );

  return (
    <header className={`public-home-header${mobileNavOpen ? " mobile-nav-open" : ""}`}>
      <div className="header-inner">
        <Link href="/" className="logo-wrap" onClick={closeMobileNav}>
          <Image
            src={BRAND_LOGO_HEADER_SRC}
            alt={BRAND_LOGO_ALT}
            width={1024}
            height={378}
            priority
            className="w-auto object-contain"
          />
        </Link>

        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileNavOpen}
          onClick={() => {
            setMobileNavOpen((open) => !open);
            if (mobileNavOpen) setOpenMenu(null);
          }}
        >
          {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <HeaderSearch />

        <nav>
          <div className="course-menu-wrap">
            <Link
              href="/courses"
              onClick={(event) => toggleSubmenu(event, "courses")}
              className={`exam-menu-trigger ${active === "courses" ? "active" : ""}`}
            >
              Courses <span className="chev">⌄</span>
            </Link>
            <div className={`course-dropdown ${openMenu === "courses" ? "open" : ""}`}>
              <Link href="/courses?type=video" onClick={closeMobileNav}><span>▶</span> Video Courses</Link>
              <Link href="/courses?type=pdf" onClick={closeMobileNav}><span>PDF</span> PDF Courses</Link>
              <Link href="/courses?type=live" onClick={closeMobileNav}><span>📡</span> Live Courses</Link>
              <Link href="/live-classes" onClick={closeMobileNav}><span>🎥</span> Live Class Schedule</Link>
            </div>
          </div>
          {navLink("/packages", "Packages", "packages")}
          <div className="exam-menu-wrap latest-exam-wrap">
            <Link
              href={cmsPages[0] ? cmsPageHref(cmsPages[0].slug) : "#"}
              onClick={(event) => toggleSubmenu(event, "latest-exam")}
              className="exam-menu-trigger"
            >
              Latest Exam <span className="chev">⌄</span>
            </Link>
            <div className={`exam-mega latest-exam-mega ${openMenu === "latest-exam" ? "open" : ""}`}>
              <div className="exam-grid">
                {cmsPages.map((page, index) => (
                  <Link key={page.id} href={cmsPageHref(page.slug)} className="exam-link" onClick={closeMobileNav}>
                    <span className={`exam-icon ${examTone(index)}`}>{initials(page.title)}</span>
                    <span className="exam-link-label">{page.title}</span>
                  </Link>
                ))}
                {!cmsPages.length && <div className="exam-empty">No exam pages available yet.</div>}
              </div>
            </div>
          </div>
          <div className="exam-menu-wrap">
            <Link
              href="/mock-tests"
              onClick={(event) => toggleSubmenu(event, "exams")}
              className="exam-menu-trigger"
            >
              Exams <span className="chev">⌄</span>
            </Link>
            <div className={`exam-mega ${openMenu === "exams" ? "open" : ""}`}>
              <div className="exam-cats">
                {mockCategories.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    className={`exam-cat ${category.slug === activeCategory?.slug ? "active" : ""}`}
                    onMouseEnter={() => setActiveCategorySlug(category.slug)}
                    onFocus={() => setActiveCategorySlug(category.slug)}
                    onClick={() => setActiveCategorySlug(category.slug)}
                  >
                    {category.name} <span>›</span>
                  </button>
                ))}
              </div>
              <div className="exam-grid">
                {displayTests(activeTests).map(({ test, title }, index) => (
                  <Link
                    key={test.slug}
                    href={`/mock-tests/${test.category_slug ?? activeCategory?.slug ?? ""}`}
                    className="exam-link"
                    onClick={closeMobileNav}
                  >
                    <span className={`exam-icon ${examTone(index)}`}>{initials(test.title)}</span>
                    <span className="exam-link-label">{title}</span>
                  </Link>
                ))}
                {!activeTests.length && <div className="exam-empty">No mock tests available in this category.</div>}
              </div>
            </div>
          </div>
          {navLink("/mock-tests", "Mock Tests", "mock-tests")}
          {navLink("/live-classes", "Live Classes", "live-classes")}
          {navLink("/faculty", "Faculty", "faculty")}
          <a href="https://krlogicsblog.com/" target="_blank" rel="noopener noreferrer" onClick={closeMobileNav}>Blog</a>
          {navLink("/contact", "Contact", "contact")}
        </nav>

        <div className="hdr-btns">
          {isLoggedIn ? (
            <>
              <Link href="/student/dashboard" className="btn-primary" onClick={closeMobileNav}>Dashboard</Link>
              <button type="button" onClick={handleLogout} className="btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost" onClick={closeMobileNav}>Login</Link>
              <Link href={registerHref} className="btn-primary" onClick={closeMobileNav}>Enroll Free →</Link>
            </>
          )}
        </div>
      </div>

      {mobileNavOpen ? <button type="button" className="mobile-nav-backdrop" aria-label="Close menu" onClick={closeMobileNav} /> : null}
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
