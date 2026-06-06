"use client";

import { CheckCircle2, Layers3, MonitorPlay, ScrollText, ShieldCheck } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";

const packages = [
  {
    title: "Complete Banking Combo",
    type: "Combo Package",
    price: "₹7,999",
    original: "₹14,999",
    includes: ["Video Courses", "Mock Tests", "Live Classes", "PDF Notes"],
    description: "One complete preparation bundle for IBPS, SBI and insurance exams with mentor-led planning.",
    featured: true,
  },
  {
    title: "Mock Test Power Pack",
    type: "Single Package",
    price: "₹1,399",
    original: "₹2,499",
    includes: ["Mock Tests", "Rank Analysis", "Sectional Tests"],
    description: "Full length and sectional mock tests with exam-like interface and performance analytics.",
  },
  {
    title: "PDF Study Material Pack",
    type: "Single Package",
    price: "₹799",
    original: "₹1,499",
    includes: ["PDF Notes", "Practice Sheets", "Current Affairs"],
    description: "Downloadable notes and topic-wise practice PDFs for quick revision and self-study.",
  },
  {
    title: "Live Class Plus",
    type: "Combo Package",
    price: "₹4,999",
    original: "₹8,999",
    includes: ["Live Classes", "Video Replay", "Doubt Sessions", "PDF Notes"],
    description: "Daily live learning plan with replay access, doubt solving and class-wise assignments.",
  },
];

const styles = `
.packages-page{min-height:100vh;background:#fbfaf2;color:#050808;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.packages-hero{background:radial-gradient(circle at 88% 12%,rgba(255,210,31,.26),transparent 28%),linear-gradient(135deg,#050808,#15140f 68%,#d6a900);color:#fff;padding:76px 5% 64px}
.packages-hero-inner{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,.8fr);gap:36px;align-items:center}
.packages-kicker{display:inline-flex;border:1px solid rgba(255,210,31,.34);border-radius:999px;color:#ffd21f;padding:8px 14px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.16em}
.packages-hero h1{margin:18px 0 14px;font-size:clamp(38px,5vw,68px);line-height:1;font-weight:950;letter-spacing:0}
.packages-hero p{max-width:660px;color:rgba(255,255,255,.72);font-size:16px;line-height:1.8}
.package-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.summary-card{border:1px solid rgba(255,210,31,.24);border-radius:8px;background:rgba(255,255,255,.08);padding:18px;backdrop-filter:blur(10px)}
.summary-card strong{display:block;color:#ffd21f;font-size:28px}.summary-card span{font-size:13px;color:rgba(255,255,255,.72);font-weight:700}
.packages-wrap{max-width:1180px;margin:0 auto;padding:42px 5% 70px}
.package-tabs{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px}
.package-tabs span{border:1px solid #e2d8ad;border-radius:999px;background:#fff8dc;color:#735400;padding:9px 14px;font-size:13px;font-weight:900}
.packages-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.package-card{position:relative;display:flex;flex-direction:column;min-height:430px;border:1px solid #e2d8ad;border-radius:8px;background:#fff;box-shadow:0 18px 44px rgba(5,8,8,.07);overflow:hidden}
.package-card.featured{border-color:#d6a900;box-shadow:0 24px 58px rgba(214,169,0,.16)}
.package-top{background:linear-gradient(135deg,#050808,#1d1b12 70%,#d6a900);color:#fff;padding:20px}
.package-type{display:inline-flex;border-radius:999px;background:#ffd21f;color:#050808;padding:5px 10px;font-size:11px;font-weight:950}
.package-top h2{margin:18px 0 10px;font-size:24px;line-height:1.12;font-weight:950}
.package-top p{color:rgba(255,255,255,.74);font-size:13px;line-height:1.6}
.package-body{display:flex;flex:1;flex-direction:column;padding:18px}
.include-list{display:grid;gap:10px;margin-bottom:18px}
.include-list div{display:flex;align-items:center;gap:9px;color:#2d2b22;font-size:13px;font-weight:800}
.include-list svg{color:#d6a900;flex:0 0 auto}
.package-price{margin-top:auto;border-top:1px solid #eee2b6;padding-top:16px}
.package-price strong{font-size:28px;font-weight:950}.package-price del{margin-left:8px;color:#8f8a77;font-size:14px}
.package-btn{margin-top:14px;display:flex;height:42px;align-items:center;justify-content:center;border-radius:8px;background:#050808;color:#ffd21f;font-weight:950;text-decoration:none}
.package-btn:hover{background:#ffd21f;color:#050808}
.why-strip{margin-top:38px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.why-item{border:1px solid #e2d8ad;border-radius:8px;background:#fffdf3;padding:18px}
.why-item svg{color:#d6a900}.why-item h3{margin:12px 0 6px;font-size:16px}.why-item p{margin:0;color:#6f6b5c;font-size:13px;line-height:1.55}
@media(max-width:1080px){.packages-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.packages-hero-inner{grid-template-columns:1fr}.why-strip{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:640px){.packages-grid,.package-summary,.why-strip{grid-template-columns:1fr}.packages-hero{padding-top:46px}.package-card{min-height:auto}}
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
            <h1>Choose Your Preparation Package</h1>
            <p>Pick single packs or combo bundles for mock tests, video courses, live classes and PDF material. Each package is designed for focused banking exam preparation.</p>
          </div>
          <div className="package-summary">
            <div className="summary-card"><strong>4+</strong><span>Package Types</span></div>
            <div className="summary-card"><strong>365</strong><span>Days Access</span></div>
            <div className="summary-card"><strong>200+</strong><span>Mock Tests</span></div>
            <div className="summary-card"><strong>24x7</strong><span>Study Access</span></div>
          </div>
        </div>
      </section>

      <section className="packages-wrap">
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
            <article key={item.title} className={`package-card ${item.featured ? "featured" : ""}`}>
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
                  <a className="package-btn" href="/register">View Package</a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="why-strip">
          <div className="why-item"><Layers3 size={26} /><h3>Combo Access</h3><p>Bundle video, mock tests, live classes and PDF content in one plan.</p></div>
          <div className="why-item"><MonitorPlay size={26} /><h3>Video Courses</h3><p>Structured recorded lessons with topic-wise preparation flow.</p></div>
          <div className="why-item"><ScrollText size={26} /><h3>PDF Courses</h3><p>Fast revision notes and downloadable practice material.</p></div>
          <div className="why-item"><ShieldCheck size={26} /><h3>Exam Ready</h3><p>Built for IBPS, SBI, RBI and insurance banking aspirants.</p></div>
        </div>
      </section>
    </main>
  );
}
