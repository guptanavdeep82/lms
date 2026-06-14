"use client";

import type { HomePageFaculty, HomePageFaq, HomePageReview } from "@/lib/home-page";

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

export function HomeReviewsSection({ reviews }: { reviews: HomePageReview[] }) {
  if (reviews.length === 0) return null;

  return (
    <>
      <section className="testi-section">
        <div className="sec-center">
          <div className="sec-eyebrow" style={{ background: "rgba(245,197,24,.15)", color: "var(--gold)" }}>
            Student Stories
          </div>
          <h2 className="sec-title" style={{ color: "#fff" }}>
            What Our Students Say
          </h2>
          <p className="sec-sub" style={{ color: "rgba(255,255,255,.55)" }}>
            Real success stories from students who cracked their banking exams with KR Logics.
          </p>
        </div>
        <div className="testi-grid">
          {reviews.map((review, index) => {
            const color = facultyColors[index % facultyColors.length];

            return (
              <div className="testi-card" key={review.id}>
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
