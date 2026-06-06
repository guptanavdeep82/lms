"use client";

import { useMemo, useState } from "react";
import { Bell, CalendarDays, CheckCircle2, Clock3, Filter, MonitorPlay, PlayCircle, Radio, Search, Users, Video } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";

const liveSessions = [
  { title: "Reasoning Speed Booster", faculty: "Karan Rajput", time: "Today, 7:00 PM", duration: "90 min", status: "live", subject: "reasoning", type: "live", students: 420 },
  { title: "Quant Doubt Solving", faculty: "Rohit Sharma", time: "Tomorrow, 8:00 PM", duration: "75 min", status: "scheduled", subject: "quant", type: "live", students: 310 },
  { title: "Banking Awareness Weekly", faculty: "Priya Kumari", time: "Friday, 6:30 PM", duration: "60 min", status: "scheduled", subject: "gk", type: "live", students: 260 },
  { title: "English Error Detection Class", faculty: "Ankita Mehra", time: "Saturday, 7:30 PM", duration: "80 min", status: "scheduled", subject: "english", type: "live", students: 290 },
  { title: "SBI PO Prelims Strategy Replay", faculty: "Karan Rajput", time: "Replay Available", duration: "55 min", status: "replay", subject: "reasoning", type: "recorded", students: 740 },
  { title: "DI Practice Marathon Replay", faculty: "Rohit Sharma", time: "Replay Available", duration: "70 min", status: "replay", subject: "quant", type: "recorded", students: 680 },
];

const filters = {
  status: [
    ["all", "All Classes"],
    ["live", "Live Now"],
    ["scheduled", "Upcoming"],
    ["replay", "Replay"],
  ],
  subject: [
    ["all", "All Subjects"],
    ["reasoning", "Reasoning"],
    ["quant", "Quant"],
    ["english", "English"],
    ["gk", "Banking GK"],
  ],
  type: [
    ["all", "All Types"],
    ["live", "Live Streaming"],
    ["recorded", "Replay Class"],
  ],
};

const styles = `
.live-page{min-height:100vh;background:#f7f6ef;color:#050808;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.live-hero{background:#050808;color:#fff;padding:42px 5%}
.live-hero-inner{max-width:1220px;margin:0 auto;display:flex;align-items:end;justify-content:space-between;gap:24px}
.live-kicker{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,210,31,.34);border-radius:999px;background:rgba(255,210,31,.08);color:#ffd21f;padding:8px 14px;font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.16em}
.live-hero h1{margin:16px 0 10px;font-size:clamp(34px,4vw,54px);line-height:1;font-weight:950;letter-spacing:0}
.live-hero p{max-width:690px;color:rgba(255,255,255,.7);font-size:15px;line-height:1.75}
.hero-live-card{min-width:280px;border:1px solid rgba(255,210,31,.3);border-radius:14px;background:rgba(255,255,255,.08);padding:16px}
.hero-live-card strong{display:block;font-size:18px}.hero-live-card span{display:block;margin-top:5px;color:rgba(255,255,255,.64);font-size:12px;font-weight:800}
.live-wrap{max-width:1220px;margin:0 auto;padding:28px 5% 70px}
.search-row{display:flex;gap:14px;align-items:center;margin-bottom:18px}
.search-box{position:relative;flex:1}.search-box svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#8a6500}.search-box input{width:100%;height:46px;border:1px solid #dfcf97;border-radius:10px;background:#fffdf3;padding:0 14px 0 44px;font-size:14px;font-weight:700;outline:none}
.result-count{border:1px solid #dfcf97;border-radius:10px;background:#fff;padding:12px 14px;font-size:13px;font-weight:950;color:#6b4d00;white-space:nowrap}
.live-layout{display:grid;grid-template-columns:270px minmax(0,1fr);gap:22px}
.filter-sidebar{border:1px solid #dfcf97;border-radius:16px;background:#fff;padding:18px;box-shadow:0 14px 32px rgba(5,8,8,.06);height:max-content;position:sticky;top:92px}
.filter-head{display:flex;align-items:center;gap:9px;margin-bottom:16px;font-size:18px;font-weight:950}.filter-head svg{color:#c79a00}
.filter-group{border-top:1px solid #efe5bd;padding-top:16px;margin-top:16px}.filter-group:first-of-type{border-top:0;padding-top:0;margin-top:0}.filter-group h3{margin:0 0 10px;font-size:11px;font-weight:950;color:#8a6500;text-transform:uppercase;letter-spacing:.16em}
.filter-options{display:grid;gap:8px}.filter-options button{height:38px;border:1px solid #e8dba9;border-radius:9px;background:#fffdf3;color:#4b3a09;text-align:left;padding:0 12px;font-size:13px;font-weight:850;cursor:pointer}.filter-options button.active{background:#050808;border-color:#050808;color:#ffd21f}.clear-btn{margin-top:18px;width:100%;height:40px;border:1px solid #050808;border-radius:9px;background:#fff;color:#050808;font-weight:950;cursor:pointer}
.class-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.class-card{border:1px solid #dfcf97;border-radius:16px;background:#fff;box-shadow:0 14px 32px rgba(5,8,8,.06);overflow:hidden}
.class-screen{height:150px;background:linear-gradient(135deg,#050808,#272412);display:grid;place-items:center;position:relative;color:#ffd21f}.class-screen:before{content:attr(data-status);position:absolute;left:14px;top:14px;border-radius:999px;background:#ffd21f;color:#050808;padding:6px 10px;font-size:10px;font-weight:950;text-transform:uppercase}.class-screen.replay:before{background:#fff;color:#050808}.class-screen.live:before{background:#e92424;color:#fff}
.play-icon{display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:#ffd21f;color:#050808}
.class-body{padding:16px}.class-body h2{margin:0;font-size:20px;font-weight:950;line-height:1.2}.class-body p{margin:8px 0 0;color:#6f6b5c;font-size:13px;line-height:1.55}
.class-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.class-meta span{display:inline-flex;align-items:center;gap:6px;border-radius:999px;background:#fff4bd;color:#6b4d00;padding:7px 9px;font-size:11px;font-weight:900}
.class-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #efe5bd;margin-top:16px;padding-top:14px}.class-footer a{display:inline-flex;height:40px;align-items:center;justify-content:center;border-radius:9px;background:#050808;color:#ffd21f;padding:0 14px;text-decoration:none;font-size:13px;font-weight:950}.class-footer small{color:#7b725c;font-weight:900}
.empty-state{grid-column:1/-1;border:1px dashed #c7b26b;border-radius:14px;background:#fffdf3;padding:34px;text-align:center;color:#6b4d00;font-weight:900}
.info-strip{margin-top:24px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.info-card{border:1px solid #dfcf97;border-radius:14px;background:#fffdf3;padding:16px}.info-card svg{color:#c79a00}.info-card h3{margin:10px 0 6px;font-size:15px;font-weight:950}.info-card p{margin:0;color:#6f6b5c;font-size:13px;line-height:1.55}
@media(max-width:980px){.live-hero-inner{display:block}.hero-live-card{margin-top:22px}.live-layout{grid-template-columns:1fr}.filter-sidebar{position:static}.class-grid{grid-template-columns:1fr}.info-strip{grid-template-columns:1fr}}
@media(max-width:640px){.live-hero,.live-wrap{padding-inline:4%}.search-row{display:block}.result-count{display:inline-block;margin-top:10px}.class-footer{display:block}.class-footer a{width:100%;margin-top:10px}}
`;

export default function LiveClassesPage() {
  const [status, setStatus] = useState("all");
  const [subject, setSubject] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return liveSessions.filter((session) => {
      if (status !== "all" && session.status !== status) return false;
      if (subject !== "all" && session.subject !== subject) return false;
      if (type !== "all" && session.type !== type) return false;
      if (query && !`${session.title} ${session.faculty} ${session.subject}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [search, status, subject, type]);

  const clearFilters = () => {
    setStatus("all");
    setSubject("all");
    setType("all");
    setSearch("");
  };

  return (
    <main className="live-page">
      <PublicHeader active="live-classes" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section className="live-hero">
        <div className="live-hero-inner">
          <div>
            <span className="live-kicker"><Radio size={15} /> Live Classes</span>
            <h1>Live Streaming Classes</h1>
            <p>Watch live classes, join upcoming sessions, and replay completed sessions from your student dashboard.</p>
          </div>
          <div className="hero-live-card">
            <strong>Today at 7:00 PM</strong>
            <span>Reasoning Speed Booster · Karan Rajput</span>
          </div>
        </div>
      </section>

      <section className="live-wrap">
        <div className="search-row">
          <div className="search-box">
            <Search size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search class, subject, faculty..." />
          </div>
          <div className="result-count">{filteredSessions.length} Classes</div>
        </div>

        <div className="live-layout">
          <aside className="filter-sidebar">
            <div className="filter-head"><Filter size={20} /> Filters</div>

            <FilterGroup title="Status" options={filters.status} value={status} onChange={setStatus} />
            <FilterGroup title="Subject" options={filters.subject} value={subject} onChange={setSubject} />
            <FilterGroup title="Class Type" options={filters.type} value={type} onChange={setType} />

            <button className="clear-btn" type="button" onClick={clearFilters}>Clear Filters</button>
          </aside>

          <div>
            <div className="class-grid">
              {filteredSessions.map((session) => (
                <article className="class-card" key={session.title}>
                  <div className={`class-screen ${session.status}`} data-status={session.status === "live" ? "Live" : session.status}>
                    <div className="play-icon"><PlayCircle size={30} fill="currentColor" /></div>
                  </div>
                  <div className="class-body">
                    <h2>{session.title}</h2>
                    <p>{session.faculty} · {session.time}</p>
                    <div className="class-meta">
                      <span><Clock3 size={14} /> {session.duration}</span>
                      <span><Users size={14} /> {session.students} students</span>
                      <span><Video size={14} /> {session.subject.toUpperCase()}</span>
                    </div>
                    <div className="class-footer">
                      <small>{session.type === "recorded" ? "Replay available" : "Attendance enabled"}</small>
                      <a href="/login">{session.status === "replay" ? "Watch Replay" : "Join Class"}</a>
                    </div>
                  </div>
                </article>
              ))}

              {!filteredSessions.length && <div className="empty-state">No live classes found for selected filters.</div>}
            </div>

            <div className="info-strip">
              <div className="info-card"><Bell size={24} /><h3>Class Reminders</h3><p>Students get alerts before scheduled sessions.</p></div>
              <div className="info-card"><MonitorPlay size={24} /><h3>Replay Access</h3><p>Completed classes can be watched again anytime.</p></div>
              <div className="info-card"><CheckCircle2 size={24} /><h3>Attendance</h3><p>Track attendance for every live class.</p></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[][];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      <div className="filter-options">
        {options.map(([optionValue, label]) => (
          <button key={optionValue} type="button" className={value === optionValue ? "active" : ""} onClick={() => onChange(optionValue)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
