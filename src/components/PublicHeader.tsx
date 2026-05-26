import Link from "next/link";

const exams = [
  ["sky", "SBI PO"],
  ["blue", "IBPS PO"],
  ["blue", "IBPS Clerk"],
  ["sky", "SBI Clerk"],
  ["blue", "IBPS RRB PO"],
  ["blue", "IBPS RRB Clerk"],
  ["gold", "Punjab and Sind Bank ..."],
  ["blue", "IBPS SO"],
  ["gray", "LIC HFL Junior Assistant"],
  ["sky", "SBI Apprentice"],
  ["red", "Bank of Baroda LBO"],
  ["purple", "Karnataka Bank"],
  ["blue", "Central Bank of India Z..."],
  ["red", "UBI Apprentice"],
  ["soft", "Indian Overseas Bank"],
  ["soft", "OICL AO"],
  ["red", "South Indian Bank Clerk"],
  ["soft", "J & K Bank Apprentice"],
  ["red", "Saraswat Bank BDO"],
  ["sky", "SBI CBO"],
  ["soft", "ECGC PO"],
];

const categories = [
  "Banking & Insurance",
  "SSC & Railway",
  "Regulatory bodies",
  "JAIIB/CAIIB",
  "JK State Exams",
  "CAIIB",
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
.public-home-header .exam-mega{position:fixed!important;left:0!important;right:0!important;top:72px!important;z-index:150!important;display:grid!important;grid-template-columns:230px 1fr!important;gap:32px!important;padding:24px 30px!important;background:#fff!important;border-top:1px solid #ded9c8!important;border-bottom:1px solid #ded9c8!important;box-shadow:0 18px 45px rgba(15,30,74,.12)!important;opacity:0!important;visibility:hidden!important;transform:translateY(10px)!important;transition:all .22s ease!important}
.public-home-header .exam-menu-wrap:hover .exam-mega{opacity:1!important;visibility:visible!important;transform:translateY(0)!important}
.public-home-header .exam-cats{display:flex!important;flex-direction:column!important;gap:12px!important}
.public-home-header .exam-cat{display:flex!important;align-items:center!important;justify-content:space-between!important;height:44px!important;border:1px solid #ded9c8!important;border-radius:7px!important;background:#fff!important;color:#050808!important;font-size:14px!important;font-weight:600!important;padding:0 12px!important}
.public-home-header .exam-cat.active{background:#fff8dc!important;border-color:rgba(255,210,31,.45)!important}
.public-home-header .exam-grid{display:grid!important;grid-template-columns:repeat(3,minmax(190px,1fr))!important;gap:11px 30px!important}
.public-home-header .exam-link{display:flex!important;align-items:center!important;gap:10px!important;height:46px!important;overflow:hidden!important;border:1px solid #dfe3ea!important;border-radius:7px!important;background:#fff!important;color:#121827!important;font-size:14px!important;font-weight:600!important;padding:0 12px!important;text-overflow:ellipsis!important;white-space:nowrap!important}
.public-home-header .exam-link:hover{border-color:#050808!important;box-shadow:0 8px 18px rgba(27,46,107,.12)!important;color:#050808!important;transform:translateY(-1px)!important}
.public-home-header .exam-icon{width:24px!important;height:24px!important;flex-shrink:0!important;display:flex!important;align-items:center!important;justify-content:center!important;border-radius:50%!important;color:#ffd21f!important;background:#050808!important;border:1px solid rgba(255,210,31,.3)!important;font-size:10px!important;font-weight:800!important}
.public-home-header .exam-icon.gold{background:#ffd21f!important;color:#050808!important}
.public-home-header .hdr-btns{display:flex!important;align-items:center!important;gap:10px!important;flex-shrink:0!important}
.public-home-header .btn-ghost,.public-home-header .btn-primary{display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:8px!important;font-size:13px!important;font-weight:700!important;min-height:36px!important;padding:8px 20px!important;text-decoration:none!important;transition:all .2s!important}
.public-home-header .btn-ghost{border:1.5px solid #ffd21f!important;color:#ffd21f!important;background:transparent!important}
.public-home-header .btn-ghost:hover{background:#ffd21f!important;color:#050808!important}
.public-home-header .btn-primary{border:0!important;background:#ffd21f!important;color:#050808!important}
.public-home-header .btn-primary:hover{background:#ffe164!important;color:#050808!important;transform:translateY(-1px)!important}
@media(max-width:1180px){.public-home-header .header-inner{gap:14px!important}.public-home-header nav{gap:14px!important}}
@media(max-width:900px){.public-home-header{padding-inline:16px!important}.public-home-header .header-inner{height:auto!important;min-height:68px!important;flex-wrap:wrap!important;padding-block:10px!important}.public-home-header nav{order:3!important;width:100%!important;height:auto!important;overflow-x:auto!important;padding:8px 0 2px!important;scrollbar-width:none!important}.public-home-header nav::-webkit-scrollbar{display:none!important}.public-home-header .hdr-btns{margin-left:auto!important}.public-home-header .exam-mega{display:none!important}}
@media(max-width:640px){.public-home-header .tagline{display:none!important}.public-home-header .btn-ghost,.public-home-header .btn-primary{padding-inline:12px!important;font-size:11px!important}}
`;

type PublicHeaderProps = {
  active?: "home" | "courses" | "mock-tests" | "faculty" | "contact";
};

export function PublicHeader({ active }: PublicHeaderProps) {
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
                  {categories.map((category, index) => (
                    <Link key={category} href="/mock-tests" className={`exam-cat ${index === 0 ? "active" : ""}`}>
                      {category} <span>›</span>
                    </Link>
                  ))}
                </div>
                <div className="exam-grid">
                  {exams.map(([tone, label]) => (
                    <Link key={label} href="/mock-tests" className="exam-link">
                      <span className={`exam-icon ${tone}`}>{label.slice(0, 2)}</span>
                      {label}
                    </Link>
                  ))}
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
