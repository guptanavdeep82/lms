"use client";

import { useCallback, useRef, useState, type ReactNode, type WheelEvent, type PointerEvent as ReactPointerEvent } from "react";

type ExamDragPaneProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Real-exam feel: native scroll is blocked. Users pan by dragging.
 * Wheel / trackpad scroll attempts show a short notice.
 */
export function ExamDragPane({ children, className = "" }: ExamDragPaneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; startY: number; startScroll: number } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | null>(null);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2200);
  }, []);

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    showNotice("Scrolling is disabled. Drag to move — like a real exam.");
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const node = ref.current;
    if (!node) return;
    drag.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startScroll: node.scrollTop,
    };
    node.setPointerCapture(event.pointerId);
    node.classList.add("is-dragging");
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    const state = drag.current;
    if (!node || !state || state.pointerId !== event.pointerId) return;
    const delta = state.startY - event.clientY;
    node.scrollTop = state.startScroll + delta;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    const state = drag.current;
    if (!node || !state || state.pointerId !== event.pointerId) return;
    drag.current = null;
    node.classList.remove("is-dragging");
    try {
      node.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`exam-drag-pane-wrap ${className}`}>
      {notice ? <div className="exam-drag-notice" role="status">{notice}</div> : null}
      <div
        ref={ref}
        className="exam-question-scroll exam-drag-pane"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {children}
      </div>
    </div>
  );
}
