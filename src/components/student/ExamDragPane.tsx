"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";

type ExamDragPaneProps = {
  children: ReactNode;
  className?: string;
};

const INTERACTIVE_SELECTOR = "input, button, textarea, select, a, label, [role='button'], [contenteditable='true']";
const DRAG_THRESHOLD_PX = 6;

/**
 * Real-exam feel: native wheel/touch scroll is blocked. Users pan by dragging
 * empty space. Clicks on radios / buttons still work.
 */
export function ExamDragPane({ children, className = "" }: ExamDragPaneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointerId: number;
    startY: number;
    startScroll: number;
    dragging: boolean;
  } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | null>(null);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2200);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      showNotice("Scrolling is disabled. Drag to move — like a real exam.");
    };

    // React's onWheel is passive — native non-passive listener is required to block scroll.
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      node.removeEventListener("wheel", onWheel);
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, [showNotice]);

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest(INTERACTIVE_SELECTOR));
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (isInteractiveTarget(event.target)) return;

    const node = ref.current;
    if (!node) return;

    drag.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startScroll: node.scrollTop,
      dragging: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    const state = drag.current;
    if (!node || !state || state.pointerId !== event.pointerId) return;

    const delta = state.startY - event.clientY;
    if (!state.dragging) {
      if (Math.abs(delta) < DRAG_THRESHOLD_PX) return;
      state.dragging = true;
      try {
        node.setPointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
      node.classList.add("is-dragging");
    }

    event.preventDefault();
    node.scrollTop = state.startScroll + delta;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    const state = drag.current;
    if (!node || !state || state.pointerId !== event.pointerId) return;

    drag.current = null;
    node.classList.remove("is-dragging");
    if (state.dragging) {
      try {
        node.releasePointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className={`exam-drag-pane-wrap ${className}`}>
      {notice ? <div className="exam-drag-notice" role="status">{notice}</div> : null}
      <div
        ref={ref}
        className="exam-question-scroll exam-drag-pane"
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
