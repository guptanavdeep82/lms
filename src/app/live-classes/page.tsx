"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CalendarDays, CheckCircle2, Clock3, Filter, MonitorPlay, PlayCircle, Radio, Search, Users, Video } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { LiveClassActionButton } from "@/components/live-classes/LiveClassActionButton";
import {
  fetchLiveSessions,
  formatLiveSessionTime,
  liveSessionStatusLabel,
  type LiveClassSessionItem,
} from "@/lib/live-classes";
import { getStudentSession } from "@/lib/student-auth";

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
.live-hero h1{margin:16px 0 10px;font-size:clamp(28px,3.2vw,44px);line-height:1;font-weight:950;letter-spacing:0}
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
.class-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #efe5bd;margin-top:16px;padding-top:14px}.class-footer small{color:#7b725c;font-weight:900}
.live-action-btn{display:inline-flex;height:40px;align-items:center;justify-content:center;gap:8px;border-radius:9px;background:#050808;color:#ffd21f;padding:0 14px;border:none;text-decoration:none;font-size:13px;font-weight:950;cursor:pointer;width:100%}
.live-action-error{margin:0;color:#b42318;font-size:11px;font-weight:800}
.price-tag{display:inline-flex;border-radius:999px;background:#050808;color:#ffd21f;padding:4px 8px;font-size:10px;font-weight:900;margin-left:6px}
.empty-state{grid-column:1/-1;border:1px dashed #c7b26b;border-radius:14px;background:#fffdf3;padding:34px;text-align:center;color:#6b4d00;font-weight:900}
.info-strip{margin-top:24px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.info-card{border:1px solid #dfcf97;border-radius:14px;background:#fffdf3;padding:16px}.info-card svg{color:#c79a00}.info-card h3{margin:10px 0 6px;font-size:15px;font-weight:950}.info-card p{margin:0;color:#6f6b5c;font-size:13px;line-height:1.55}
@media(max-width:980px){.live-hero-inner{display:block}.hero-live-card{margin-top:22px}.live-layout{grid-template-columns:1fr}.filter-sidebar{position:static}.class-grid{grid-template-columns:1fr}.info-strip{grid-template-columns:1fr}}
@media(max-width:640px){.live-hero,.live-wrap{padding-inline:4%}.search-row{display:block}.result-count{display:inline-block;margin-top:10px}.class-footer{display:block}.class-footer .live-action-btn{margin-top:10px}}
`;

export default function LiveClassesPage() {
  const [liveSessions, setLiveSessions] = useState<LiveClassSessionItem[]>([]);
  const [status, setStatus] = useState("all");
  const [subject, setSubject] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");

  const loadSessions = useCallback(() => {
    const email = getStudentSession()?.email;
    fetchLiveSessions(email).then(setLiveSessions);
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const featuredSession = liveSessions.find((session) => session.display_status === "live") ?? liveSessions[0];

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return liveSessions.filter((session) => {
      const sessionSubject = session.course.subject || "general";
      const sessionType = session.display_status === "replay" ? "recorded" : "live";

      if (status !== "all" && session.display_status !== status) return false;
      if (subject !== "all" && sessionSubject !== subject) return false;
      if (type !== "all" && sessionType !== type) return false;
      if (query && !`${session.title} ${session.faculty_name} ${session.course.title}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [liveSessions, search, status, subject, type]);

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
            <p>Join Zoom live classes instantly. Free classes open after login. Paid classes unlock after course purchase. Recordings auto-save after class ends.</p>
          </div>
          <div className="hero-live-card">
            <strong>{featuredSession ? formatLiveSessionTime(featuredSession.scheduled_at) : "Schedule available soon"}</strong>
            <span>
              {featuredSession
                ? `${featuredSession.title} · ${featuredSession.faculty_name || featuredSession.course.title}`
                : "Admin can schedule sessions from Live Class Sessions"}
            </span>
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
                <article className="class-card" key={session.id}>
                  <div className={`class-screen ${session.display_status}`} data-status={liveSessionStatusLabel(session.display_status)}>
                    <div className="play-icon"><PlayCircle size={30} fill="currentColor" /></div>
                  </div>
                  <div className="class-body">
                    <h2>
                      {session.title}
                      {session.course.is_free ? (
                        <span className="price-tag">FREE</span>
                      ) : (
                        <span className="price-tag">₹{session.course.effective_price}</span>
                      )}
                    </h2>
                    <p>{session.faculty_name || session.course.exam_type || "KR Logics Faculty"} · {formatLiveSessionTime(session.scheduled_at)}</p>
                    <div className="class-meta">
                      <span><Clock3 size={14} /> {session.duration_minutes} min</span>
                      <span><CalendarDays size={14} /> {session.course.category || "Live"}</span>
                      <span><Video size={14} /> {(session.course.subject || "general").toUpperCase()}</span>
                    </div>
                    <div className="class-footer">
                      <small>
                        {session.has_recording
                          ? "Recording available"
                          : session.display_status === "live"
                            ? "Live now on Zoom"
                            : session.course.is_free
                              ? "Free after login"
                              : "Purchase required"}
                      </small>
                      <LiveClassActionButton session={session} onAccessChange={loadSessions} />
                    </div>
                  </div>
                </article>
              ))}

              {!filteredSessions.length && <div className="empty-state">No live classes found. Schedule sessions from admin panel.</div>}
            </div>

            <div className="info-strip">
              <div className="info-card"><Bell size={24} /><h3>Zoom Live Join</h3><p>Students join directly on Zoom after login and access check.</p></div>
              <div className="info-card"><MonitorPlay size={24} /><h3>Auto Recording</h3><p>Cloud recording syncs automatically when Zoom class ends.</p></div>
              <div className="info-card"><CheckCircle2 size={24} /><h3>Free / Paid Access</h3><p>Free courses join after login. Paid courses need purchase first.</p></div>
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
