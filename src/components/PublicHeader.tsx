"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { mockTestsApiUrl, type MockCategory, type MockTest, type MockTestsResponse } from "@/lib/mock-tests";

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

const headerStyles = `
.public-home-header{position:sticky!important;top:0!important;z-index:100!important;padding:0 5%!important;background:rgba(5,8,8,.96)!important;border-bottom:1px solid rgba(255,210,31,.28)!important;box-shadow:0 12px 30px rgba(5,8,8,.12)!important;backdrop-filter:blur(10px)!important}
.public-home-header .header-inner{display:flex!important;align-items:center!important;justify-content:space-between!important;height:72px!important;gap:20px!important}
.public-home-header .logo-wrap{display:flex!important;align-items:center!important;gap:12px!important;flex-shrink:0!important;color:inherit!important;text-decoration:none!important}
.public-home-header .logo-wrap>svg{display:none!important}
.public-home-header .logo-wrap:before{content:""!important;display:block!important;width:52px!important;height:52px!important;flex:0 0 52px!important;border-radius:50%!important;background:url("/logics-logo.jpeg") center/cover no-repeat!important;box-shadow:0 0 0 2px rgba(255,210,31,.35),0 10px 28px rgba(0,0,0,.22)!important}
.public-home-header .logo-text-group{display:flex!important;flex-direction:column!important;line-height:1.2!important}
.public-home-header .brand{font-family:Sora,ui-sans-serif,system-ui,sans-serif!important;font-size:20px!important;font-weight:800!important;color:#fff!important}
.public-home-header .brand span{color:#ffd21f!important}
.public-home-header .tagline{font-size:9px!important;color:rgba(255,255,255,.62)!important;letter-spacing:1.5px!important;text-transform:uppercase!important;font-weight:600!important}
.public-home-header nav{display:flex!important;gap:24px!important;align-items:center!important;height:100%!important}
.public-home-header nav a,.public-home-header .exam-menu-trigger{display:inline-flex!important;align-items:center!important;height:100%!important;border-bottom:2px solid transparent!important;color:rgba(255,255,255,.74)!important;font-size:13px!important;font-weight:600!important;line-height:1!important;padding:4px 0!important;text-decoration:none!important;transition:color .2s,border-color .2s!important;white-space:nowrap!important}
.public-home-header nav>a:hover,.public-home-header nav>a.active,.public-home-header .exam-menu-trigger:hover{color:#ffd21f!important;border-bottom-color:#ffd21f!important}
.public-home-header .exam-menu-wrap{position:relative!important;display:flex!important;align-items:center!important;height:100%!important;line-height:1!important}
.public-home-header .chev{font-size:13px!important;transition:transform .2s!important}
.public-home-header .exam-menu-wrap:hover .chev{transform:rotate(180deg)!important}
.public-home-header .exam-mega{position:fixed!important;left:50%!important;right:auto!important;top:72px!important;z-index:150!important;display:grid!important;grid-template-columns:240px minmax(660px,840px)!important;gap:18px!important;width:min(calc(100vw - 40px),1120px)!important;max-height:calc(100vh - 96px)!important;overflow:auto!important;padding:20px!important;background:#fff!important;border:1px solid #ded9c8!important;border-radius:0 0 14px 14px!important;box-shadow:0 18px 45px rgba(15,30,74,.12)!important;opacity:0!important;visibility:hidden!important;transform:translate(-50%,10px)!important;transition:all .22s ease!important}
.public-home-header .exam-menu-wrap:hover .exam-mega{opacity:1!important;visibility:visible!important;transform:translate(-50%,0)!important}
.public-home-header .exam-cats{display:flex!important;flex-direction:column!important;gap:8px!important}
.public-home-header .exam-cat{display:flex!important;align-items:center!important;justify-content:space-between!important;height:44px!important;border:1px solid #ded9c8!important;border-radius:7px!important;background:#fff!important;color:#050808!important;font-size:14px!important;font-weight:600!important;padding:0 12px!important}
.public-home-header .exam-cat.active{background:#fff8dc!important;border-color:rgba(255,210,31,.45)!important}
.public-home-header .exam-grid{display:grid!important;grid-template-columns:repeat(3,minmax(200px,1fr))!important;align-content:start!important;gap:10px 14px!important}
.public-home-header .exam-link{display:flex!important;align-items:center!important;gap:10px!important;height:46px!important;overflow:hidden!important;border:1px solid #dfe3ea!important;border-radius:7px!important;background:#fff!important;color:#121827!important;font-size:14px!important;font-weight:600!important;padding:0 12px!important;text-overflow:ellipsis!important;white-space:nowrap!important}
.public-home-header .exam-link:hover{border-color:#050808!important;box-shadow:0 8px 18px rgba(27,46,107,.12)!important;color:#050808!important;transform:translateY(-1px)!important}
.public-home-header .exam-icon{width:24px!important;height:24px!important;flex-shrink:0!important;display:flex!important;align-items:center!important;justify-content:center!important;border-radius:50%!important;color:#ffd21f!important;background:#050808!important;border:1px solid rgba(255,210,31,.3)!important;font-size:10px!important;font-weight:800!important}
.public-home-header .exam-icon.gold{background:#ffd21f!important;color:#050808!important}
.public-home-header .exam-icon.sky,.public-home-header .exam-icon.blue,.public-home-header .exam-icon.gray,.public-home-header .exam-icon.purple,.public-home-header .exam-icon.red,.public-home-header .exam-icon.soft{background:#050808!important;color:#ffd21f!important}
.public-home-header .exam-empty{grid-column:1/-1!important;border:1px dashed #ded9c8!important;border-radius:8px!important;padding:18px!important;color:#667085!important;font-size:13px!important;font-weight:700!important;text-align:center!important}
.public-home-header .hdr-btns{display:flex!important;align-items:center!important;gap:10px!important;flex-shrink:0!important}
.public-home-header .btn-ghost,.public-home-header .btn-primary{display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:8px!important;font-size:13px!important;font-weight:700!important;min-height:36px!important;padding:8px 20px!important;text-decoration:none!important;transition:all .2s!important}
.public-home-header .btn-ghost{border:1.5px solid #ffd21f!important;color:#ffd21f!important;background:transparent!important}
.public-home-header .btn-ghost:hover{background:#ffd21f!important;color:#050808!important}
.public-home-header .btn-primary{border:0!important;background:#ffd21f!important;color:#050808!important}
.public-home-header .btn-primary:hover{background:#ffe164!important;color:#050808!important;transform:translateY(-1px)!important}
@media(max-width:1180px){.public-home-header .header-inner{gap:14px!important}.public-home-header nav{gap:14px!important}.public-home-header .exam-mega{grid-template-columns:220px 1fr!important}.public-home-header .exam-grid{grid-template-columns:repeat(2,minmax(180px,1fr))!important}}
@media(max-width:900px){.public-home-header{padding-inline:16px!important}.public-home-header .header-inner{height:auto!important;min-height:68px!important;flex-wrap:wrap!important;padding-block:10px!important}.public-home-header nav{order:3!important;width:100%!important;height:auto!important;overflow-x:auto!important;padding:8px 0 2px!important;scrollbar-width:none!important}.public-home-header nav::-webkit-scrollbar{display:none!important}.public-home-header .hdr-btns{margin-left:auto!important}.public-home-header .exam-mega{display:none!important}}
@media(max-width:640px){.public-home-header .tagline{display:none!important}.public-home-header .btn-ghost,.public-home-header .btn-primary{padding-inline:12px!important;font-size:11px!important}}
`;

type PublicHeaderProps = {
  active?: "home" | "courses" | "mock-tests" | "faculty" | "contact";
};

export function PublicHeader({ active }: PublicHeaderProps) {
  const [mockCategories, setMockCategories] = useState<MockCategory[]>(fallbackCategories);
  const [activeCategorySlug, setActiveCategorySlug] = useState(fallbackCategories[0].slug);

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

  const activeCategory = useMemo(() => {
    return mockCategories.find((category) => category.slug === activeCategorySlug) ?? mockCategories[0] ?? null;
  }, [activeCategorySlug, mockCategories]);

  const activeTests = activeCategory?.tests ?? [];

  const navLink = (href: string, label: string, key?: PublicHeaderProps["active"]) => (
    <Link href={href} className={key && active === key ? "active" : ""}>
      {label}
    </Link>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />
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
            {navLink("/#about", "About")}
            {navLink("/courses", "Courses", "courses")}
            <div className="exam-menu-wrap">
              <Link href="/mock-tests" className="exam-menu-trigger">Exams <span className="chev">⌄</span></Link>
              <div className="exam-mega">
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
            <Link href="/login" className="btn-ghost">Login</Link>
            <Link href="/register" className="btn-primary">Enroll Free →</Link>
          </div>
        </div>
      </header>
    </>
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
