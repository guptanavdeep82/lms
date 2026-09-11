"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, FileText, Loader2, Newspaper, Search } from "lucide-react";
import { BookmarkButton } from "@/components/student/BookmarkButton";
import { fetchCurrentAffairs, type CurrentAffairItem } from "@/lib/current-affairs";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function daysInMonth(year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const count = new Date(year, month, 0).getDate();
  const startWeekday = first.getDay();
  const cells: Array<number | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= count; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function StudentCurrentAffairsPanel() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<CurrentAffairItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const date = params.get("date");
    if (!date) return;
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return;
    setYear(parsed.getFullYear());
    setMonth(parsed.getMonth() + 1);
    setSelectedDay(parsed.getDate());
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCurrentAffairs(year, month, search.trim() ? { q: search.trim() } : undefined)
      .then((rows) => {
        if (mounted) setItems(rows);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [year, month, search]);

  const itemsByDay = useMemo(() => {
    const map = new Map<number, CurrentAffairItem[]>();
    for (const item of items) {
      if (!item.date) continue;
      const day = Number(item.date.slice(8, 10));
      const list = map.get(day) ?? [];
      list.push(item);
      map.set(day, list);
    }
    return map;
  }, [items]);

  const selectedItems = itemsByDay.get(selectedDay) ?? [];
  const cells = daysInMonth(year, month);
  const selectedLabel = `${selectedDay} ${monthNames[month - 1]} ${year}`;
  const todayStamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  function changeMonth(delta: number) {
    const next = new Date(year, month - 1 + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth() + 1);
    setSelectedDay(1);
  }

  function jump(days: number) {
    const next = new Date(year, month - 1, selectedDay + days);
    setYear(next.getFullYear());
    setMonth(next.getMonth() + 1);
    setSelectedDay(next.getDate());
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#172a69] via-[#0957D3] to-[#13a38b] p-6 text-white shadow-[0_22px_60px_rgba(23,42,105,0.18)] sm:p-8">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/70">Daily Capsule</p>
        <h2 className="mt-2 text-[24px] font-extrabold tracking-[-0.04em] sm:text-[30px]">Current Affairs</h2>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-white/75">
          Banking, economy and exam-focused notes. Pick a date, search a topic, and bookmark what you want to revise later.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth() + 1); setSelectedDay(now.getDate()); }}
            className="inline-flex h-9 items-center rounded-full bg-white/12 px-4 text-xs font-extrabold ring-1 ring-white/20 hover:bg-white/18"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => jump(-1)}
            className="inline-flex h-9 items-center rounded-full bg-white/12 px-4 text-xs font-extrabold ring-1 ring-white/20 hover:bg-white/18"
          >
            Previous day
          </button>
          <button
            type="button"
            onClick={() => jump(1)}
            className="inline-flex h-9 items-center rounded-full bg-white/12 px-4 text-xs font-extrabold ring-1 ring-white/20 hover:bg-white/18"
          >
            Next day
          </button>
        </div>
      </section>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7d8799]" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search this month by title or content..."
          className="h-12 w-full rounded-2xl border border-[#dfe5ef] bg-white pl-11 pr-4 text-sm font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
        />
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[28px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={() => changeMonth(-1)} className="grid h-10 w-10 place-items-center rounded-2xl bg-[#eef3fb] text-[#172a69]" aria-label="Previous month">
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#7d8799]">Calendar</p>
              <h3 className="text-lg font-extrabold text-[#172a69]">{monthNames[month - 1]} {year}</h3>
            </div>
            <button type="button" onClick={() => changeMonth(1)} className="grid h-10 w-10 place-items-center rounded-2xl bg-[#eef3fb] text-[#172a69]" aria-label="Next month">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#7a8db0]">
            {weekDays.map((day) => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} />;
              const stamp = `${year}-${pad(month)}-${pad(day)}`;
              const hasNotes = itemsByDay.has(day);
              const selected = day === selectedDay;
              const isToday = stamp === todayStamp;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`relative h-12 rounded-2xl text-sm font-extrabold transition ${
                    selected
                      ? "bg-[#172a69] text-white shadow-lg shadow-[#172a69]/20"
                      : hasNotes
                        ? "bg-[#eef3fb] text-[#172a69]"
                        : "text-[#334155] hover:bg-[#f5f8fc]"
                  }`}
                >
                  {day}
                  {isToday && !selected ? <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-[#f5c518]" /> : null}
                  {hasNotes ? <span className={`absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${selected ? "bg-[#f5c518]" : "bg-[#0957D3]"}`} /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#7d8799]">Selected date</p>
              <h3 className="mt-1 flex items-center gap-2 text-lg font-extrabold text-[#172a69]">
                <CalendarDays size={18} /> {selectedLabel}
              </h3>
            </div>
            <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-extrabold text-[#172a69]">
              {selectedItems.length} note{selectedItems.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading ? (
            <div className="grid min-h-48 place-items-center">
              <Loader2 className="animate-spin text-[#0957D3]" />
            </div>
          ) : selectedItems.length === 0 ? (
            <div className="rounded-[20px] border border-dashed border-[#dfe5ef] bg-[#f8fafc] p-8 text-center">
              <Newspaper size={30} className="mx-auto text-[#c7d2e5]" />
              <p className="mt-3 text-sm font-bold text-[#667085]">No current affairs published for this date yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedItems.map((item) => (
                <article key={item.id} className="rounded-[22px] border border-[#eef3fb] bg-gradient-to-br from-[#f8fbff] to-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#7d8799]">{item.date}</p>
                      <h4 className="mt-1 text-base font-extrabold text-[#0E318D]">{item.title}</h4>
                    </div>
                    <BookmarkButton
                      type="current_affair"
                      id={item.id}
                      title={item.title}
                      url={`/student/current-affairs?date=${item.date || ""}`}
                      excerpt={item.date || undefined}
                      className="shrink-0"
                    />
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-[#334155]">{item.content}</p>
                  {item.pdf_url ? (
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-[#0957D3] px-3 text-xs font-extrabold text-white"
                    >
                      <FileText size={14} /> Open PDF
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
