"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Loader2 } from "lucide-react";
import { CurrentAffairBody } from "@/components/current-affairs/CurrentAffairBody";
import { PublicPageShell } from "@/components/PublicPageShell";
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

export default function CurrentAffairsPage() {
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [items, setItems] = useState<CurrentAffairItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
    setSelectedDay(now.getDate());
  }, []);

  useEffect(() => {
    if (year == null || month == null) return;
    let mounted = true;
    setLoading(true);
    fetchCurrentAffairs(year, month)
      .then((rows) => {
        if (mounted) setItems(rows);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [year, month]);

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

  const selectedItems = selectedDay != null ? itemsByDay.get(selectedDay) ?? [] : [];
  const cells = year != null && month != null ? daysInMonth(year, month) : [];

  function changeMonth(delta: number) {
    if (year == null || month == null) return;
    const next = new Date(year, month - 1 + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth() + 1);
    setSelectedDay(1);
  }

  const monthLabel = year != null && month != null ? `${monthNames[month - 1]} ${year}` : "Current Affairs";
  const selectedLabel = year != null && month != null && selectedDay != null
    ? `${selectedDay} ${monthNames[month - 1]} ${year}`
    : "Select a date";

  return (
    <PublicPageShell active="current-affairs" className="min-h-screen bg-[#f5f8fc] text-[#0E318D]">
      <section className="bg-[#0E318D] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/70">Daily Capsule</p>
          <h1 className="mt-3 text-[28px] font-extrabold tracking-[-0.04em] sm:text-[38px]">Current Affairs</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/70">
            Exam-focused banking and economy notes published by KR Logics faculty. Select a date to read the capsule.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="rounded-2xl border border-[#dfe8f6] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={() => changeMonth(-1)} className="grid h-9 w-9 place-items-center rounded-full bg-[#eef3fb] text-[#0E318D]" aria-label="Previous month">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-lg font-extrabold">{monthLabel}</h2>
            <button type="button" onClick={() => changeMonth(1)} className="grid h-9 w-9 place-items-center rounded-full bg-[#eef3fb] text-[#0E318D]" aria-label="Next month">
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
              const hasNotes = itemsByDay.has(day);
              const selected = day === selectedDay;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`relative h-11 rounded-xl text-sm font-extrabold ${
                    selected ? "bg-[#0957D3] text-white" : hasNotes ? "bg-[#eef3fb] text-[#0E318D]" : "text-[#334155] hover:bg-[#f5f8fc]"
                  }`}
                >
                  {day}
                  {hasNotes ? <span className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${selected ? "bg-white" : "bg-[#0957D3]"}`} /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe8f6] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#7a8db0]">
            {selectedLabel}
          </p>
          {loading ? (
            <div className="grid min-h-48 place-items-center">
              <Loader2 className="animate-spin text-[#0957D3]" />
            </div>
          ) : selectedItems.length === 0 ? (
            <p className="mt-6 text-sm font-semibold text-[#667085]">No current affairs published for this date yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {selectedItems.map((item) => (
                <article key={item.id} className="rounded-xl border border-[#eef3fb] bg-[#f8fbff] p-4">
                  <h3 className="text-base font-extrabold text-[#0E318D]">{item.title}</h3>
                  <CurrentAffairBody content={item.content} />
                  {item.pdf_url ? (
                    <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg bg-[#0957D3] px-3 text-xs font-extrabold text-white">
                      <FileText size={14} /> Open PDF
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicPageShell>
  );
}
