"use client";

import { useEffect, useState } from "react";
import { defaultHomePageSettings, type HomePageFaculty, type HomePageFaq, type HomePageReview, type HomePageSettings } from "@/lib/home-page";

const facultyColors = ["#1B2E6B", "#15803D", "#185FA5", "#D85A30", "#7F77DD", "#BA7517"];
const facultyBackgrounds = ["var(--light2)", "#F0FDF4", "#EEF6FF", "#FFF7ED", "#F5F3FF", "#FFF8EB"];

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "KR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function buildStars(rating: number): string[] {
  return Array.from({ length: 5 }, (_, index) => (index < rating ? "full" : "dim"));
}

export function HomeFacultySection({ faculties }: { faculties: HomePageFaculty[] }) {
  if (faculties.length === 0) return null;

  return (
    <>
      <section className="faculty-section" id="faculty">
        <div className="sec-center">
          <div className="sec-eyebrow">Expert Mentors</div>
          <h2 className="sec-title">Our Faculty</h2>
          <p className="sec-sub">
            Learn from experienced educators with proven track records in banking exam coaching across India.
          </p>
        </div>
        <div className="faculty-grid">
          {faculties.map((faculty, index) => {
            const color = facultyColors[index % facultyColors.length];
            const background = facultyBackgrounds[index % facultyBackgrounds.length];

            return (
              <div className="faculty-card" key={faculty.id}>
                <div className="faculty-top" style={{ background }}>
                  {faculty.image_url ? (
                    <img
                      className="faculty-avatar-img"
                      src={faculty.image_url}
                      alt={faculty.title}
                    />
                  ) : (
                    <div className="faculty-avatar" style={{ background: color }}>
                      {initialsFromName(faculty.title)}
                    </div>
                  )}
                </div>
                <div className="faculty-body">
                  <div className="faculty-name">{faculty.title}</div>
                  <div className="faculty-role">{faculty.designation}</div>
                  <div className="faculty-exp">{faculty.experience?.trim() || "Experienced mentor"}</div>
                  <div className="faculty-chips">
                    {faculty.course_keywords.map((keyword) => (
                      <span className="fchip" key={`${faculty.id}-${keyword}`}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <div className="divider" />
    </>
  );
}

export function HomeReviewsSection({
  reviews,
  playStoreUrl,
}: {
  reviews: HomePageReview[];
  playStoreUrl?: string | null;
}) {
  if (reviews.length === 0) return null;

  const fromPlayStore = reviews.some((review) => review.source === "play_store");

  return (
    <>
      <section className="testi-section">
        <div className="sec-center">
          <div className="sec-eyebrow" style={{ background: "rgba(245,197,24,.15)", color: "var(--gold)" }}>
            Google Play
          </div>
          <h2 className="sec-title" style={{ color: "#fff" }}>
            Google Play Reviews
          </h2>
          <p className="sec-sub" style={{ color: "rgba(255,255,255,.55)" }}>
            {fromPlayStore
              ? "Real Google Play reviews from students who use the KR Logics app."
              : "Real success stories from students who cracked their banking exams with KR Logics."}
          </p>
        </div>
        <div className="testi-grid">
          {reviews.map((review, index) => {
            const color = facultyColors[index % facultyColors.length];

            return (
              <div className="testi-card" key={String(review.id)}>
                <div className="testi-stars">
                  {buildStars(review.rating).map((state, starIndex) => (
                    <i
                      key={`${review.id}-star-${starIndex}`}
                      className="fa fa-star"
                      style={state === "dim" ? { opacity: 0.25 } : undefined}
                    />
                  ))}
                </div>
                <div className="testi-text">&quot;{review.description}&quot;</div>
                <div className="testi-author">
                  {review.image_url ? (
                    <img className="testi-avatar-img" src={review.image_url} alt={review.name} />
                  ) : (
                    <div className="testi-avatar" style={{ background: color }}>
                      {initialsFromName(review.name)}
                    </div>
                  )}
                  <div>
                    <div className="testi-name">{review.name}</div>
                    <div className="testi-bank">{review.exam_name?.trim() || "KR Logics Student"}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {playStoreUrl ? (
          <div className="play-store-cta">
            <a href={playStoreUrl} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-google-play" />
              See all reviews on Google Play
            </a>
          </div>
        ) : null}
      </section>
    </>
  );
}

export function HomeFaqSection({ faqs }: { faqs: HomePageFaq[] }) {
  if (faqs.length === 0) return null;

  return (
    <>
      <section className="faq-section" id="faq">
        <div className="sec-center">
          <div className="sec-eyebrow">Common Questions</div>
          <h2 className="sec-title">Frequently Asked Questions</h2>
          <p className="sec-sub">Everything you need to know about KR Logics courses and platform.</p>
        </div>
        <div className="faq-wrap">
          {faqs.map((faq, index) => (
            <div className={`faq-item${index === 0 ? " open" : ""}`} key={faq.id}>
              <div className="faq-q">
                {faq.question}
                <span className="faq-toggle">
                  <i className="fa fa-plus" />
                </span>
              </div>
              <div className="faq-ans">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="divider" />
    </>
  );
}

function faClass(icon: string) {
  if (icon.startsWith("fa ") || icon.startsWith("fab ") || icon.startsWith("fas ") || icon.startsWith("far ")) return icon;
  if (["fa-whatsapp", "fa-youtube", "fa-instagram", "fa-facebook-f", "fa-telegram-plane", "fa-telegram"].includes(icon)) {
    return `fab ${icon}`;
  }
  return `fa ${icon}`;
}

export function HomeTopCourseTiles({
  settings,
}: {
  courses?: unknown;
  settings?: HomePageSettings | null;
}) {
  const fallback = defaultHomePageSettings.top_course_tiles;
  const source = settings?.top_course_tiles?.length ? settings.top_course_tiles : fallback;
  const tiles = fallback.map((defaultTile, index) => {
    const tile = source[index] ?? defaultTile;
    const items = defaultTile.items.map((defaultItem, itemIndex) => {
      const item = tile.items?.[itemIndex] ?? defaultItem;
      const resolved = resolveTileUrl(item.url || defaultItem.url, settings, item.icon || defaultItem.icon);
      return {
        ...defaultItem,
        ...item,
        url: resolved,
        external: /^https?:\/\//i.test(resolved),
      };
    });

    return {
      title: tile.title || defaultTile.title,
      tone: tile.tone || defaultTile.tone,
      items,
    };
  });

  if (!tiles.length) return null;

  return (
    <>
      <section className="courses-section course-tiles-section" id="courses">
        <div className="courses-header">
          <div>
            <div className="sec-eyebrow">Programs</div>
            <h2 className="sec-title">Top Courses</h2>
          </div>
          <a href="/courses" className="view-all-btn">View All Courses →</a>
        </div>
        <div className="course-tiles-grid">
          {tiles.map((tile) => (
            <article className={`course-tone-tile tone-${tile.tone}`} key={tile.title}>
              <h3>{tile.title}</h3>
              <div className="course-tone-items">
                {tile.items.map((item) => (
                  <a
                    key={`${tile.title}-${item.label}`}
                    href={item.url}
                    className="course-tone-item"
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span className="course-tone-ic">
                      <i className={faClass(item.icon)} />
                    </span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="divider" />
    </>
  );
}

export function HomeOfferBar({ settings }: { settings?: HomePageSettings | null }) {
  const offer = settings?.offer_bar;
  const remaining = useOfferCountdown(offer?.ends_at ?? null);

  if (!offer?.enabled) return null;
  if (offer.ends_at && remaining && remaining.total <= 0) return null;

  const href = offer.btn_url?.trim() || "/courses";
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <section className="offer-bar">
      <div className="offer-left">
        <span className="offer-flame"><i className="fa fa-fire" /> Limited Time Offer</span>
        <h3>
          {offer.title} <em>{offer.highlight}</em> {offer.suffix}
        </h3>
        {offer.description ? (
          <p><i className="fa fa-clock" /> {offer.description}</p>
        ) : null}
      </div>
      {remaining ? (
        <div className="offer-timer">
          <div className="otile"><strong>{String(remaining.days).padStart(2, "0")}</strong><small>Days</small></div>
          <div className="otile"><strong>{String(remaining.hours).padStart(2, "0")}</strong><small>Hours</small></div>
          <div className="otile"><strong>{String(remaining.mins).padStart(2, "0")}</strong><small>Mins</small></div>
          <div className="otile"><strong>{String(remaining.secs).padStart(2, "0")}</strong><small>Secs</small></div>
        </div>
      ) : null}
      <div className="offer-right">
        {offer.code ? (
          <div className="offer-code"><small>Use Code:</small><b>{offer.code}</b></div>
        ) : null}
        <a
          href={href}
          className="offer-btn"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {offer.btn_text || "Grab The Offer"} <i className="fa fa-arrow-right" />
        </a>
      </div>
    </section>
  );
}

function resolveTileUrl(url: string, settings?: HomePageSettings | null, icon = "") {
  const raw = url.trim();
  const key = raw.toLowerCase();
  const iconKey = icon.toLowerCase();

  if (key === "whatsapp" || key.includes("wa.me") || key.includes("whatsapp") || iconKey.includes("whatsapp")) {
    const digits = (settings?.whatsapp_number || "").replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : "/contact";
  }
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }
  if (key === "youtube" || iconKey.includes("youtube")) {
    return settings?.youtube_link || "/contact";
  }
  if (key === "instagram" || iconKey.includes("instagram")) {
    return settings?.instagram_link || "/contact";
  }
  if (key === "facebook" || iconKey.includes("facebook")) {
    return settings?.facebook_link || "/contact";
  }
  return raw || "/courses";
}

function useOfferCountdown(endsAt: string | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endsAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  if (!endsAt) return null;
  const end = new Date(endsAt).getTime();
  if (Number.isNaN(end)) return null;
  const total = Math.max(0, end - now);
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const mins = Math.floor((total % 3600000) / 60000);
  const secs = Math.floor((total % 60000) / 1000);
  return { total, days, hours, mins, secs };
}
