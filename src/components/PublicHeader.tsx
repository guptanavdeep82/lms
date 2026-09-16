"use client";

import { type MouseEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cmsPageHref, fetchHeaderCmsPages, type CmsPageSummary } from "@/lib/cms-pages";
import { BRAND_LOGO_ALT, BRAND_LOGO_HEADER_SRC } from "@/lib/brand";
import { HeaderSearch } from "@/components/HeaderSearch";
import { TrendingLinksBar } from "@/components/home/TrendingLinksBar";
import { getStudentSession, logoutStudent } from "@/lib/student-auth";

type ActiveKey = "home" | "courses" | "packages" | "mock-tests" | "contact" | "live-classes" | "current-affairs" | "faq";

type PublicHeaderProps = {
  active?: ActiveKey;
  pages?: CmsPageSummary[];
};

type MenuKey = "courses" | "latest-exam";

function activeFromPath(pathname: string): ActiveKey | undefined {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/courses")) return "courses";
  if (pathname.startsWith("/packages")) return "packages";
  if (pathname.startsWith("/mock-tests")) return "mock-tests";
  if (pathname.startsWith("/live-classes")) return "live-classes";
  if (pathname.startsWith("/current-affairs")) return "current-affairs";
  if (pathname.startsWith("/faq")) return "faq";
  if (pathname.startsWith("/contact")) return "contact";
  return undefined;
}

export function PublicHeader({ active, pages }: PublicHeaderProps) {
  const pathname = usePathname() || "/";
  const currentActive = active ?? activeFromPath(pathname);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cmsPages, setCmsPages] = useState<CmsPageSummary[]>(pages ?? []);

  useEffect(() => {
    setCmsPages(pages ?? []);
  }, [pages]);

  useEffect(() => {
    if (pages) return;
    let mounted = true;

    fetchHeaderCmsPages().then((headerPages) => {
      if (mounted) setCmsPages(headerPages);
    });

    return () => {
      mounted = false;
    };
  }, [pages]);

  useEffect(() => {
    const syncSession = () => setIsLoggedIn(Boolean(getStudentSession()));
    syncSession();
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

  const headerPages = useMemo(
    () => cmsPages.filter((page) => page.show_in_header !== false),
    [cmsPages],
  );

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

  const navLink = (href: string, label: string, key?: ActiveKey) => (
    <Link href={href} className={key && currentActive === key ? "active" : ""} onClick={closeMobileNav}>
      {label}
    </Link>
  );

  return (
    <>
      <TrendingLinksBar />
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
            {navLink("/", "Home", "home")}
            <div className="course-menu-wrap">
              <Link
                href="/courses"
                onClick={(event) => toggleSubmenu(event, "courses")}
                className={`exam-menu-trigger ${currentActive === "courses" ? "active" : ""}`}
              >
                Courses <span className="chev">⌄</span>
              </Link>
              <div className={`course-dropdown ${openMenu === "courses" ? "open" : ""}`}>
                <Link href="/courses?type=video" onClick={closeMobileNav}><span>▶</span> Video Courses</Link>
                <Link href="/courses?type=pdf" onClick={closeMobileNav}><span>PDF</span> PDF Courses</Link>
              </div>
            </div>
            <div className="exam-menu-wrap latest-exam-wrap">
              <Link
                href={headerPages[0] ? cmsPageHref(headerPages[0].slug) : "#"}
                onClick={(event) => toggleSubmenu(event, "latest-exam")}
                className="exam-menu-trigger"
              >
                Latest Exam <span className="chev">⌄</span>
              </Link>
              <div className={`exam-mega latest-exam-mega ${openMenu === "latest-exam" ? "open" : ""}`}>
                <div className="exam-grid">
                  {headerPages.map((page, index) => (
                    <Link key={page.id} href={cmsPageHref(page.slug)} className="exam-link" onClick={closeMobileNav}>
                      <span className={`exam-icon ${examTone(index)}`}>{initials(page.title)}</span>
                      <span className="exam-link-label">{page.title}</span>
                    </Link>
                  ))}
                  {!headerPages.length && <div className="exam-empty">No exam pages available yet.</div>}
                </div>
              </div>
            </div>
            {navLink("/mock-tests", "Mock Tests", "mock-tests")}
            {navLink("/current-affairs", "Current Affairs", "current-affairs")}
            {navLink("/live-classes", "Live Classes", "live-classes")}
            <a href="https://krlogicsblog.com/" target="_blank" rel="noopener noreferrer" onClick={closeMobileNav}>Blog</a>
            {navLink("/faq", "FAQ", "faq")}
            {navLink("/contact", "Contact", "contact")}
            <div className="hdr-btns-in-nav">
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
    </>
  );
}

function getRegisterHref() {
  return "/register";
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
