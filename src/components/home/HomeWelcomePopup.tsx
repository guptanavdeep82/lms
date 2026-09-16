"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { HomePageSettings } from "@/lib/home-page";
import "./home-welcome-popup.css";

type HomeWelcomePopupProps = {
  settings?: HomePageSettings | null;
};

export function HomeWelcomePopup({ settings = null }: HomeWelcomePopupProps) {
  const popup = settings?.welcome_popup;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup?.enabled) {
      setOpen(false);
      return;
    }

    const timer = window.setTimeout(() => setOpen(true), 280);
    return () => window.clearTimeout(timer);
  }, [popup?.enabled]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!popup?.enabled || !open) return null;

  const href = popup.btn_url?.trim() || "/courses";
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <div className="welcome-popup-overlay" role="presentation" onClick={() => setOpen(false)}>
      <div
        className="welcome-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-popup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="welcome-popup-close" aria-label="Close popup" onClick={() => setOpen(false)}>
          <X size={18} />
        </button>

        {popup.image_url ? (
          <div className="welcome-popup-media">
            <img src={popup.image_url} alt="" />
          </div>
        ) : (
          <div className="welcome-popup-hero">
            <span className="welcome-popup-badge">{popup.eyebrow || "KR Logics"}</span>
            <i className="fa fa-graduation-cap" aria-hidden="true" />
          </div>
        )}

        <div className="welcome-popup-body">
          {popup.image_url && popup.eyebrow ? (
            <span className="welcome-popup-kicker">{popup.eyebrow}</span>
          ) : null}
          <h2 id="welcome-popup-title">{popup.title}</h2>
          {popup.description ? <p>{popup.description}</p> : null}
          <a
            href={href}
            className="welcome-popup-cta"
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() => setOpen(false)}
          >
            {popup.btn_text || "Open Link"}
            <i className="fa fa-arrow-right" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
