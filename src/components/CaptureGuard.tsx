"use client";

import { useEffect, useState } from "react";

/**
 * Soft exam-style deterrents for screenshots / screen capture on the website.
 * Browsers cannot fully block OS capture; this reduces casual copying and
 * blanks the page while the tab is hidden (common during screen recording).
 */
export function CaptureGuard() {
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let noticeTimer: number | null = null;

    const flashNotice = (message: string) => {
      setNotice(message);
      if (noticeTimer) window.clearTimeout(noticeTimer);
      noticeTimer = window.setTimeout(() => setNotice(null), 2200);
    };

    const onContextMenu = (event: Event) => {
      event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const printScreen = key === "printscreen" || event.keyCode === 44;
      const saveShortcut = ctrl && key === "s";
      const copyShortcut = ctrl && (key === "c" || key === "x" || key === "a");
      const captureShortcut =
        printScreen ||
        (ctrl && shift && (key === "s" || key === "i" || key === "c")) ||
        (event.metaKey && shift && (key === "3" || key === "4" || key === "5"));

      if (printScreen || saveShortcut || captureShortcut) {
        event.preventDefault();
        flashNotice("Screenshots and screen recording are not allowed on this website.");
      }

      if (copyShortcut) {
        const target = event.target as HTMLElement | null;
        const tag = target?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea" && !target?.isContentEditable) {
          event.preventDefault();
        }
      }
    };

    const syncHidden = () => {
      document.documentElement.classList.toggle("kr-capture-hidden", document.visibilityState === "hidden");
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyDown, true);
    document.addEventListener("visibilitychange", syncHidden);
    syncHidden();

    document.documentElement.classList.add("kr-capture-guard");

    return () => {
      if (noticeTimer) window.clearTimeout(noticeTimer);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("keyup", onKeyDown, true);
      document.removeEventListener("visibilitychange", syncHidden);
      document.documentElement.classList.remove("kr-capture-guard", "kr-capture-hidden");
    };
  }, []);

  if (!notice) return null;

  return (
    <div className="kr-capture-block" role="alert" aria-live="assertive">
      <div className="kr-capture-block-card">
        <p className="kr-capture-block-title">Screen capture blocked</p>
        <p className="kr-capture-block-text">{notice}</p>
      </div>
    </div>
  );
}
