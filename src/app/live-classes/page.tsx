"use client";

import { Bell, CalendarDays, CheckCircle2, Clock3, MonitorPlay, PlayCircle, Radio, ShieldCheck, Users, Video } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";

const liveSessions = [
  {
    title: "Reasoning Speed Booster",
    faculty: "Karan Rajput",
    time: "Today, 7:00 PM",
    duration: "90 min",
    status: "Live Soon",
    subject: "Reasoning",
  },
  {
    title: "Quant Doubt Solving",
    faculty: "Rohit Sharma",
    time: "Tomorrow, 8:00 PM",
    duration: "75 min",
    status: "Scheduled",
    subject: "Quant",
  },
  {
    title: "Banking Awareness Weekly",
    faculty: "Priya Kumari",
    time: "Friday, 6:30 PM",
    duration: "60 min",
    status: "Scheduled",
    subject: "GK",
  },
  {
    title: "English Error Detection Class",
    faculty: "Ankita Mehra",
    time: "Saturday, 7:30 PM",
    duration: "80 min",
    status: "Scheduled",
    subject: "English",
  },
];

const styles = `
.live-page{min-height:100vh;background:#f7f3df;color:#050808;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.live-hero{position:relative;overflow:hidden;background:#050808;color:#fff;padding:66px 5% 52px}
.live-hero:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 82% 10%,rgba(255,210,31,.36),transparent 28%),linear-gradient(120deg,#050808 0%,#10100d 58%,#c79a00 100%);pointer-events:none}
.live-hero-inner{position:relative;z-index:1;max-width:1220px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(340px,.8fr);gap:34px;align-items:center}
.live-kicker{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,210,31,.34);border-radius:999px;background:rgba(255,210,31,.08);color:#ffd21f;padding:8px 14px;font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.16em}
.live-hero h1{margin:18px 0 14px;max-width:760px;font-size:clamp(40px,5vw,72px);line-height:.96;font-weight:950;letter-spacing:0}
.live-hero p{max-width:650px;color:rgba(255,255,255,.72);font-size:16px;line-height:1.8}
.live-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
.live-actions a{display:inline-flex;height:46px;align-items:center;justify-content:center;gap:9px;border-radius:8px;padding:0 18px;font-size:13px;font-weight:950;text-decoration:none}
.live-primary{background:#ffd21f;color:#050808}.live-secondary{border:1px solid rgba(255,210,31,.38);color:#ffd21f;background:rgba(255,255,255,.05)}
.stream-card{border:1px solid rgba(255,210,31,.3);border-radius:18px;background:rgba(255,255,255,.08);padding:16px;box-shadow:0 28px 80px rgba(0,0,0,.28);backdrop-filter:blur(12px)}
.stream-screen{position:relative;overflow:hidden;border-radius:14px;background:linear-gradient(135deg,#111,#272412);aspect-ratio:16/10;display:grid;place-items:center;border:1px solid rgba(255,210,31,.22)}
.stream-screen:before{content:"LIVE";position:absolute;left:16px;top:16px;border-radius:999px;background:#e92424;color:#fff;padding:6px 10px;font-size:11px;font-weight:950;letter-spacing:.08em}
.play-orb{display:grid;place-items:center;width:78px;height:78px;border-radius:50%;background:#ffd21f;color:#050808;box-shadow:0 0 0 18px rgba(255,210,31,.14)}
.stream-meta{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:14px;color:#fff}
.stream-meta strong{display:block;font-size:18px}.stream-meta span{font-size:12px;color:rgba(255,255,255,.65);font-weight:800}
.live-wrap{max-width:1220px;margin:0 auto;padding:42px 5% 70px}
.live-grid{display:grid;grid-template-columns:minmax(0,.72fr) minmax(360px,.28fr);gap:22px}
.section-title{margin:0 0 18px;font-size:32px;line-height:1;font-weight:950}
.session-list{display:grid;gap:14px}
.session-card{display:grid;grid-template-columns:54px minmax(0,1fr) auto;gap:16px;align-items:center;border:1px solid #dfcf97;border-radius:16px;background:#fff;padding:18px;box-shadow:0 14px 32px rgba(5,8,8,.06)}
.session-icon{display:grid;place-items:center;width:54px;height:54px;border-radius:14px;background:#050808;color:#ffd21f}
.session-card h3{margin:0;font-size:19px;font-weight:950}.session-card p{margin:6px 0 0;color:#6f6b5c;font-size:13px;line-height:1.5}
.session-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.session-tags span{border-radius:999px;background:#fff4bd;color:#6b4d00;padding:6px 9px;font-size:11px;font-weight:900}
.join-btn{display:inline-flex;height:42px;align-items:center;justify-content:center;border-radius:9px;background:#050808;color:#ffd21f;padding:0 16px;text-decoration:none;font-size:13px;font-weight:950;white-space:nowrap}
.side-panel{display:grid;gap:16px;align-content:start}
.info-card{border:1px solid #dfcf97;border-radius:16px;background:#fffdf3;padding:20px;box-shadow:0 14px 30px rgba(5,8,8,.05)}
.info-card svg{color:#c79a00}.info-card h3{margin:12px 0 6px;font-size:17px;font-weight:950}.info-card p{margin:0;color:#6f6b5c;font-size:13px;line-height:1.6}
.feature-strip{margin-top:26px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.feature-card{border:1px solid #dfcf97;border-radius:16px;background:#fff;padding:18px}.feature-card svg{color:#c79a00}.feature-card h3{margin:12px 0 6px;font-size:15px;font-weight:950}.feature-card p{margin:0;color:#6f6b5c;font-size:13px;line-height:1.55}
@media(max-width:1020px){.live-hero-inner,.live-grid{grid-template-columns:1fr}.feature-strip{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:640px){.live-hero{padding:46px 4%}.live-wrap{padding-inline:4%}.stream-meta,.session-card{display:block}.session-icon{margin-bottom:12px}.join-btn{margin-top:14px;width:100%}.feature-strip{grid-template-columns:1fr}}
`;

export default function LiveClassesPage() {
  return (
    <main className="live-page">
      <PublicHeader active="live-classes" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section className="live-hero">
        <div className="live-hero-inner">
          <div>
            <span className="live-kicker"><Radio size={15} /> Live Streaming Classes</span>
            <h1>Attend Live Classes From Your Student Dashboard</h1>
            <p>Students can join live classes, watch replays, track attendance, and follow upcoming subject-wise sessions for banking exam preparation.</p>
            <div className="live-actions">
              <a className="live-primary" href="#live-schedule"><CalendarDays size={17} /> View Schedule</a>
              <a className="live-secondary" href="/login"><MonitorPlay size={17} /> Student Login</a>
            </div>
          </div>

          <aside className="stream-card">
            <div className="stream-screen">
              <div className="play-orb"><PlayCircle size={38} fill="currentColor" /></div>
            </div>
            <div className="stream-meta">
              <div>
                <strong>Reasoning Speed Booster</strong>
                <span>Today at 7:00 PM · Karan Rajput</span>
              </div>
              <a className="join-btn" href="/login">Join Now</a>
            </div>
          </aside>
        </div>
      </section>

      <section className="live-wrap" id="live-schedule">
        <div className="live-grid">
          <div>
            <h2 className="section-title">Upcoming Live Sessions</h2>
            <div className="session-list">
              {liveSessions.map((session) => (
                <article className="session-card" key={session.title}>
                  <div className="session-icon"><Video size={24} /></div>
                  <div>
                    <h3>{session.title}</h3>
                    <p>{session.faculty} · {session.time} · {session.duration}</p>
                    <div className="session-tags">
                      <span>{session.subject}</span>
                      <span>{session.status}</span>
                      <span>Attendance Enabled</span>
                    </div>
                  </div>
                  <a className="join-btn" href="/login">View Class</a>
                </article>
              ))}
            </div>
          </div>

          <aside className="side-panel">
            <div className="info-card"><Bell size={26} /><h3>Class Alerts</h3><p>Students can receive reminders before every scheduled live class.</p></div>
            <div className="info-card"><Clock3 size={26} /><h3>Replay Access</h3><p>Completed sessions can be watched again from the student dashboard.</p></div>
            <div className="info-card"><ShieldCheck size={26} /><h3>Secure Access</h3><p>Only enrolled students can join package-based live sessions.</p></div>
          </aside>
        </div>

        <div className="feature-strip">
          <div className="feature-card"><Users size={25} /><h3>Attendance Tracking</h3><p>Track who joined each live class and session replay.</p></div>
          <div className="feature-card"><CheckCircle2 size={25} /><h3>Doubt Solving</h3><p>Faculty can run live doubt sessions for enrolled students.</p></div>
          <div className="feature-card"><MonitorPlay size={25} /><h3>Zoom / Meet Ready</h3><p>Use live streaming links from Zoom, Meet, or any class platform.</p></div>
          <div className="feature-card"><CalendarDays size={25} /><h3>Batch Schedule</h3><p>Show upcoming classes by course, package, or subject.</p></div>
        </div>
      </section>
    </main>
  );
}
