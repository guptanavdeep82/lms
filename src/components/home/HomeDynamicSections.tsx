"use client";

import type { HomePageFaculty, HomePageFaq, HomePageReview, HomePageSettings, HomeTopCourse } from "@/lib/home-page";

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

type CourseTileItem = {
  label: string;
  url: string;
  icon: string;
  external?: boolean;
};

type CourseTile = {
  title: string;
  tone: string;
  items: CourseTileItem[];
};

function courseIcon(type: string | null | undefined) {
  if (type === "pdf") return "fa-file-pdf";
  if (type === "live") return "fa-video";
  return "fa-circle-play";
}

function faClass(icon: string) {
  if (icon.startsWith("fa ") || icon.startsWith("fab ")) return icon;
  if (["fa-whatsapp", "fa-youtube", "fa-instagram", "fa-facebook-f", "fa-telegram-plane"].includes(icon)) {
    return `fab ${icon}`;
  }
  return `fa ${icon}`;
}

function shortLabel(title: string) {
  const value = title.trim();
  return value.length > 22 ? `${value.slice(0, 20)}…` : value;
}

function courseItems(courses: HomeTopCourse[], fallbacks: CourseTileItem[]) {
  const fromCourses = courses.slice(0, 4).map((course) => ({
    label: shortLabel(course.title),
    url: `/courses/${course.slug}`,
    icon: courseIcon(course.course_type),
  }));

  const seen = new Set(fromCourses.map((item) => item.label.toLowerCase()));
  const extras = fallbacks.filter((item) => !seen.has(item.label.toLowerCase()));

  return [...fromCourses, ...extras].slice(0, 4);
}

export function HomeTopCourseTiles({
  courses,
  settings,
}: {
  courses: HomeTopCourse[];
  settings?: HomePageSettings | null;
}) {
  const videoCourses = courses.filter((course) => course.course_type === "video");
  const pdfCourses = courses.filter((course) => course.course_type === "pdf");
  const liveCourses = courses.filter((course) => course.course_type === "live");
  const whatsappHref = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/[^\d]/g, "")}`
    : null;

  const tiles: CourseTile[] = [
    {
      title: "Popular",
      tone: "lavender",
      items: courseItems(courses, [
        { label: "PDF Courses", url: "/courses?type=pdf", icon: "fa-file-pdf" },
        { label: "Mock Tests", url: "/mock-tests", icon: "fa-clipboard-list" },
        { label: "Live Classes", url: "/live-classes", icon: "fa-video" },
        { label: "Current Affairs", url: "/current-affairs", icon: "fa-newspaper" },
      ]),
    },
    {
      title: "Video Classes",
      tone: "mint",
      items: courseItems(videoCourses.length ? videoCourses : courses, [
        { label: "Video Courses", url: "/courses?type=video", icon: "fa-circle-play" },
        { label: "Live Classes", url: "/live-classes", icon: "fa-video" },
        { label: "Quant Practice", url: "/courses", icon: "fa-calculator" },
        { label: "Reasoning", url: "/courses", icon: "fa-brain" },
      ]),
    },
    {
      title: "PDF Courses",
      tone: "sky",
      items: courseItems(pdfCourses.length ? pdfCourses : courses.slice().reverse(), [
        { label: "PDF Courses", url: "/courses?type=pdf", icon: "fa-file-pdf" },
        { label: "Study Notes", url: "/notes", icon: "fa-book-open" },
        { label: "Free PDFs", url: "/courses?type=pdf", icon: "fa-file-arrow-down" },
        { label: "Descriptive", url: "/courses", icon: "fa-pen-nib" },
      ]),
    },
    {
      title: "Free Materials",
      tone: "peach",
      items: courseItems(liveCourses, [
        { label: "Free PDFs", url: "/courses?type=pdf", icon: "fa-file-lines" },
        { label: "Practice Quiz", url: "/mock-tests", icon: "fa-list-check" },
        { label: "Daily CA", url: "/current-affairs", icon: "fa-calendar-day" },
        { label: "Mock Tests", url: "/mock-tests", icon: "fa-bolt" },
      ]),
    },
    {
      title: "Follow Us",
      tone: "rose",
      items: [
        { label: "WhatsApp", url: whatsappHref || "/contact", icon: "fa-whatsapp", external: Boolean(whatsappHref) },
        { label: "YouTube", url: settings?.youtube_link || "https://www.youtube.com", icon: "fa-youtube", external: true },
        { label: "Instagram", url: settings?.instagram_link || "https://www.instagram.com", icon: "fa-instagram", external: true },
        { label: "Facebook", url: settings?.facebook_link || "https://www.facebook.com", icon: "fa-facebook-f", external: true },
      ],
    },
  ];

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
