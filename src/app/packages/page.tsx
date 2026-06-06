"use client";

import { BadgePercent, BookOpenCheck, CheckCircle2, Crown, Layers3, MonitorPlay, Trophy } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";

const packages = [
  {
    title: "Complete Banking Combo",
    type: "Combo Package",
    price: "₹7,999",
    original: "₹14,999",
    includes: ["Video Courses", "Mock Tests", "Live Classes", "PDF Notes"],
    description: "One complete preparation bundle for IBPS, SBI and insurance exams with mentor-led planning.",
    accent: "gold",
    tag: "Most Value",
    featured: true,
  },
  {
    title: "Mock Test Power Pack",
    type: "Single Package",
    price: "₹1,399",
    original: "₹2,499",
    includes: ["Mock Tests", "Rank Analysis", "Sectional Tests"],
    description: "Full length and sectional mock tests with exam-like interface and performance analytics.",
    accent: "black",
    tag: "Test Series",
  },
  {
    title: "PDF Study Material Pack",
    type: "Single Package",
    price: "₹799",
    original: "₹1,499",
    includes: ["PDF Notes", "Practice Sheets", "Current Affairs"],
    description: "Downloadable notes and topic-wise practice PDFs for quick revision and self-study.",
    accent: "cream",
    tag: "Self Study",
  },
  {
    title: "Live Class Plus",
    type: "Combo Package",
    price: "₹4,999",
    original: "₹8,999",
    includes: ["Live Classes", "Video Replay", "Doubt Sessions", "PDF Notes"],
    description: "Daily live learning plan with replay access, doubt solving and class-wise assignments.",
    accent: "gold",
    tag: "Live Batch",
  },
];

const styles = `
.packages-page{min-height:100vh;background:#f7f3df;color:#050808;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.packages-hero{position:relative;overflow:hidden;background:#050808;color:#fff;padding:70px 5% 56px}
.packages-hero:before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,rgba(5,8,8,.98) 0%,rgba(5,8,8,.9) 46%,rgba(214,169,0,.88) 100%),radial-gradient(circle at 76% 16%,rgba(255,210,31,.42),transparent 28%);pointer-events:none}
.packages-hero:after{content:"";position:absolute;right:-120px;bottom:-180px;width:460px;height:460px;border:1px solid rgba(255,210,31,.24);border-radius:50%;box-shadow:inset 0 0 0 42px rgba(255,210,31,.05)}
.packages-hero-inner{position:relative;z-index:1;max-width:1220px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(340px,.82fr);gap:38px;align-items:center}
.packages-kicker{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,210,31,.34);border-radius:999px;background:rgba(255,210,31,.08);color:#ffd21f;padding:8px 14px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.16em}
.packages-hero h1{margin:18px 0 14px;max-width:760px;font-size:clamp(42px,5.2vw,76px);line-height:.95;font-weight:950;letter-spacing:0}
.packages-hero p{max-width:660px;color:rgba(255,255,255,.74);font-size:16px;line-height:1.8}
.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
.hero-actions a{display:inline-flex;height:46px;align-items:center;justify-content:center;border-radius:8px;padding:0 18px;font-size:13px;font-weight:950;text-decoration:none}
.hero-primary{background:#ffd21f;color:#050808}.hero-secondary{border:1px solid rgba(255,210,31,.38);color:#ffd21f;background:rgba(255,255,255,.05)}
.package-spotlight{position:relative;border:1px solid rgba(255,210,31,.3);border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.06));padding:18px;box-shadow:0 28px 80px rgba(0,0,0,.28);backdrop-filter:blur(12px)}
.spotlight-card{border-radius:14px;background:#fff;color:#050808;padding:22px;box-shadow:0 18px 40px rgba(0,0,0,.22)}
.spotlight-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.spotlight-badge{display:inline-flex;align-items:center;gap:7px;border-radius:999px;background:#050808;color:#ffd21f;padding:7px 11px;font-size:11px;font-weight:950;text-transform:uppercase}
.spotlight-save{border-radius:999px;background:#fff4bd;color:#614700;padding:7px 10px;font-size:11px;font-weight:950}
.spotlight-card h2{margin:18px 0 8px;font-size:30px;line-height:1.05;font-weight:950}
.spotlight-card p{color:#625d4d;font-size:13px;line-height:1.65}
.spotlight-meter{margin-top:18px;display:grid;gap:9px}
.meter-row{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:900;color:#322b16}
.meter-bar{height:10px;border-radius:999px;background:#ede3b9;overflow:hidden}.meter-bar span{display:block;height:100%;width:76%;background:linear-gradient(90deg,#050808,#d6a900)}
.package-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:16px}
.summary-card{border:1px solid #eadcae;border-radius:10px;background:#fffdf3;padding:14px}.summary-card strong{display:block;color:#050808;font-size:24px;font-weight:950}.summary-card span{font-size:12px;color:#716850;font-weight:800}
.packages-wrap{max-width:1220px;margin:0 auto;padding:42px 5% 72px}
.section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:22px}
.section-head h2{margin:0;font-size:34px;line-height:1;font-weight:950}.section-head p{margin:8px 0 0;color:#716850;font-size:14px;line-height:1.65}
.package-tabs{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:26px}
.package-tabs span{border:1px solid #d8c37e;border-radius:999px;background:#fffdf3;color:#5d4500;padding:10px 15px;font-size:13px;font-weight:950;box-shadow:0 8px 22px rgba(129,91,0,.08)}
.package-tabs span:first-child{background:#050808;color:#ffd21f;border-color:#050808}
.packages-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.package-card{position:relative;display:flex;flex-direction:column;min-height:468px;border:1px solid #dfcf97;border-radius:18px;background:#fff;box-shadow:0 18px 44px rgba(5,8,8,.08);overflow:hidden;transition:transform .22s ease,box-shadow .22s ease}
.package-card:hover{transform:translateY(-7px);box-shadow:0 28px 62px rgba(5,8,8,.15)}
.package-card.featured{border-color:#d6a900;box-shadow:0 26px 70px rgba(159,115,0,.18)}
.package-ribbon{position:absolute;right:14px;top:14px;z-index:2;border-radius:999px;background:#ffd21f;color:#050808;padding:7px 10px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em}
.package-top{position:relative;color:#fff;padding:22px;min-height:190px;overflow:hidden}
.package-top:before{content:"";position:absolute;right:-42px;top:-42px;width:150px;height:150px;border-radius:50%;background:rgba(255,210,31,.18)}
.package-card.gold .package-top{background:linear-gradient(135deg,#050808 0%,#171711 58%,#d6a900 100%)}
.package-card.black .package-top{background:linear-gradient(135deg,#050808 0%,#1f2522 100%)}
.package-card.cream .package-top{background:linear-gradient(135deg,#ffffff 0%,#fff4bd 100%);color:#050808}
.package-type{position:relative;display:inline-flex;border-radius:999px;background:rgba(255,210,31,.96);color:#050808;padding:6px 11px;font-size:11px;font-weight:950}
.package-card.cream .package-type{background:#050808;color:#ffd21f}
.package-top h2{position:relative;margin:18px 0 10px;font-size:25px;line-height:1.08;font-weight:950}
.package-top p{position:relative;margin:0;color:rgba(255,255,255,.76);font-size:13px;line-height:1.6}
.package-card.cream .package-top p{color:#625d4d}
.package-body{display:flex;flex:1;flex-direction:column;padding:19px}
.include-list{display:grid;gap:10px;margin-bottom:18px}
.include-list div{display:flex;align-items:center;gap:9px;color:#2d2b22;font-size:13px;font-weight:850}
.include-list svg{color:#c79a00;flex:0 0 auto}
.package-price{margin-top:auto;border-top:1px solid #eee2b6;padding-top:16px}
.package-price strong{font-size:30px;font-weight:950}.package-price del{margin-left:8px;color:#8f8a77;font-size:14px}
.package-note{margin-top:5px;color:#7b725c;font-size:11px;font-weight:800}
.package-btn{margin-top:14px;display:flex;height:44px;align-items:center;justify-content:center;border-radius:10px;background:#050808;color:#ffd21f;font-weight:950;text-decoration:none;transition:all .18s}
.package-btn:hover{background:#ffd21f;color:#050808}
.why-strip{margin-top:42px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.why-item{border:1px solid #dfcf97;border-radius:16px;background:#fffdf3;padding:20px;box-shadow:0 14px 30px rgba(5,8,8,.05)}
.why-item svg{color:#c79a00}.why-item h3{margin:12px 0 6px;font-size:16px;font-weight:950}.why-item p{margin:0;color:#6f6b5c;font-size:13px;line-height:1.55}
@media(max-width:1080px){.packages-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.packages-hero-inner{grid-template-columns:1fr}.why-strip{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:720px){.packages-hero{padding:46px 4%}.packages-wrap{padding-inline:4%}.packages-grid,.package-summary,.why-strip{grid-template-columns:1fr}.section-head{display:block}.package-card{min-height:auto}.package-top{min-height:auto}.spotlight-card h2{font-size:26px}}
`;

export default function PackagesPage() {
  return (
    <main className="packages-page">
      <PublicHeader active="packages" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="packages-hero">
        <div className="packages-hero-inner">
          <div>
            <span className="packages-kicker">KR Logics Packages</span>
            <h1>Build Your Banking Exam Prep Stack</h1>
            <p>Pick single packs or combo bundles for mock tests, video courses, live classes and PDF material. Each package is designed for focused banking exam preparation.</p>
            <div className="hero-actions">
              <a className="hero-primary" href="#all-packages">Explore Packages</a>
              <a className="hero-secondary" href="/contact">Talk to Counsellor</a>
            </div>
          </div>
          <div className="package-spotlight">
            <div className="spotlight-card">
              <div className="spotlight-top">
                <span className="spotlight-badge"><Crown size={15} /> Popular Combo</span>
                <span className="spotlight-save">Save 46%</span>
              </div>
              <h2>Complete Banking Combo</h2>
              <p>Mock tests, video course, live classes and PDF notes in one focused plan for serious aspirants.</p>
              <div className="spotlight-meter">
                <div className="meter-row"><span>Prep Coverage</span><span>76%</span></div>
                <div className="meter-bar"><span /></div>
              </div>
              <div className="package-summary">
                <div className="summary-card"><strong>4+</strong><span>Package Types</span></div>
                <div className="summary-card"><strong>365</strong><span>Days Access</span></div>
                <div className="summary-card"><strong>200+</strong><span>Mock Tests</span></div>
                <div className="summary-card"><strong>24x7</strong><span>Study Access</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="packages-wrap" id="all-packages">
        <div className="section-head">
          <div>
            <h2>Preparation Packages</h2>
            <p>Choose a single product or combine multiple learning tools in one value plan.</p>
          </div>
          <BadgePercent size={34} color="#c79a00" />
        </div>
        <div className="package-tabs">
          <span>All Packages</span>
          <span>Combo Packages</span>
          <span>Single Packages</span>
          <span>Mock Test</span>
          <span>Courses</span>
          <span>Live Classes</span>
          <span>PDF</span>
        </div>
        <div className="packages-grid">
          {packages.map((item) => (
            <article key={item.title} className={`package-card ${item.accent} ${item.featured ? "featured" : ""}`}>
              <div className="package-ribbon">{item.tag}</div>
              <div className="package-top">
                <span className="package-type">{item.type}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <div className="package-body">
                <div className="include-list">
                  {item.includes.map((include) => (
                    <div key={include}><CheckCircle2 size={17} /> {include}</div>
                  ))}
                </div>
                <div className="package-price">
                  <strong>{item.price}</strong><del>{item.original}</del>
                  <div className="package-note">Includes student dashboard access</div>
                  <a className="package-btn" href="/register">View Package</a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="why-strip">
          <div className="why-item"><Layers3 size={26} /><h3>Combo Access</h3><p>Bundle video, mock tests, live classes and PDF content in one plan.</p></div>
          <div className="why-item"><MonitorPlay size={26} /><h3>Video Courses</h3><p>Structured recorded lessons with topic-wise preparation flow.</p></div>
          <div className="why-item"><BookOpenCheck size={26} /><h3>Smart Practice</h3><p>Practice, revise and analyze progress from a single student dashboard.</p></div>
          <div className="why-item"><Trophy size={26} /><h3>Exam Ready</h3><p>Built for IBPS, SBI, RBI and insurance banking aspirants.</p></div>
        </div>
      </section>
    </main>
  );
}
