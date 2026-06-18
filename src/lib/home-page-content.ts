import {
  formatCompactStat,
  formatStatNumber,
  extractYouTubeId,
  type HomePageSettings,
  type HomeTopCourse,
} from "@/lib/home-page";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildHeroStatsMarkup(settings: HomePageSettings): string {
  const experience = settings.experience?.trim() || "7+ Years";

  return `<div class="hero-stats">
        <div class="hstat"><strong>${formatStatNumber(settings.active_students)}</strong><small>Active Students</small></div>
        <div class="hstat"><strong>${formatStatNumber(settings.selections)}</strong><small>Selections</small></div>
        <div class="hstat"><strong>${formatStatNumber(settings.mock_tests)}</strong><small>Mock Tests</small></div>
        <div class="hstat"><strong>${escapeHtml(experience)}</strong><small>Experience</small></div>
      </div>`;
}

export function buildAboutStatsMarkup(settings: HomePageSettings): string {
  const experience = settings.experience?.trim() || "7+ Years";

  return `<div class="about-stat-row">
            <div class="about-stat-box"><strong>${escapeHtml(experience.replace(/ Years?$/i, "") || experience)}</strong><small>Years</small></div>
            <div class="about-stat-box"><strong>${formatCompactStat(settings.active_students)}</strong><small>Students</small></div>
            <div class="about-stat-box"><strong>${formatStatNumber(settings.selections)}</strong><small>Selected</small></div>
          </div>`;
}

export function buildSelectionsMiniCardMarkup(settings: HomePageSettings): string {
  return `<div style="font-family:'Sora',sans-serif;font-size:30px;font-weight:800;color:var(--navy)">${formatStatNumber(settings.selections)}</div>`;
}

export function buildAboutVideoMarkup(videoUrl: string | null): string {
  const videoId = videoUrl ? extractYouTubeId(videoUrl) : null;
  const embedSrc = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : "https://www.youtube.com/embed/y--mLNQ14Co?rel=0";

  return `<div class="about-video-card">
  <iframe
    src="${embedSrc}"
    title="KR Logics introduction video"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>`;
}

export function buildBannerSliderMarkup(bannerImages: string[]): string {
  if (bannerImages.length === 0) {
    return "";
  }

  const slides = bannerImages
    .map(
      (image, index) => `<a href="/courses" class="hero-ad-slide${index % 3 === 1 ? " alt" : index % 3 === 2 ? " dark" : ""}" style="background-image:url('${escapeHtml(image)}');background-size:cover;background-position:center;">
        <span>Featured Offer</span>
        <strong>KR Logics Update ${index + 1}</strong>
        <em>Promoted from admin home page settings.</em>
        <b>Explore Now</b>
      </a>`,
    )
    .join("");

  return `<div class="hero-admin-ad-slider" aria-label="Admin advertisement banner">
    <div class="hero-ad-track">${slides}</div>
  </div>`;
}

function socialLink(href: string | null, iconClass: string, label: string): string {
  if (!href) {
    return `<div class="fsoc" aria-hidden="true"><i class="${iconClass}"></i></div>`;
  }

  return `<a class="fsoc" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="${label}"><i class="${iconClass}"></i></a>`;
}

export function buildFooterSocialsMarkup(settings: HomePageSettings): string {
  const whatsappHref = settings.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/[^\d]/g, "")}`
    : null;

  return `<div class="footer-socials">
        ${socialLink(settings.facebook_link, "fab fa-facebook-f", "Facebook")}
        ${socialLink(settings.instagram_link, "fab fa-instagram", "Instagram")}
        ${socialLink(settings.youtube_link, "fab fa-youtube", "YouTube")}
        ${socialLink(settings.linkedin_link, "fab fa-linkedin-in", "LinkedIn")}
        ${socialLink(whatsappHref, "fab fa-whatsapp", "WhatsApp")}
      </div>`;
}

export function buildContactPhoneMarkup(whatsappNumber: string | null): string {
  if (!whatsappNumber?.trim()) {
    return "<p>+91 98765 43210<br>+91 87654 32109</p>";
  }

  return `<p>${escapeHtml(whatsappNumber)}</p>`;
}

export function applyHomePageData(markup: string, settings: HomePageSettings): string {
  let nextMarkup = markup;

  nextMarkup = nextMarkup.replace(
    /<div class="hero-stats">(?:\s*<div class="hstat">[\s\S]*?<\/div>){4}\s*<\/div>\s*(?=<\/div>\s*<div class="hero-right">)/,
    buildHeroStatsMarkup(settings),
  );
  nextMarkup = nextMarkup.replace(
    /<div class="about-stat-row">(?:\s*<div class="about-stat-box">[\s\S]*?<\/div>){3}\s*<\/div>/,
    buildAboutStatsMarkup(settings),
  );
  nextMarkup = nextMarkup.replace(
    /<div style="font-family:'Sora',sans-serif;font-size:30px;font-weight:800;color:var\(--navy\)">850\+<\/div>/,
    buildSelectionsMiniCardMarkup(settings),
  );

  nextMarkup = nextMarkup.replace(
    /<div class="footer-socials">[\s\S]*<\/div>(?=\s*<\/div>\s*<div class="footer-col">)/,
    buildFooterSocialsMarkup(settings),
  );

  const phoneCardPattern = /<div class="c-card"><div class="c-icon"><i class="fa fa-phone"><\/i><\/div><div class="c-text"><h4>Call Us<\/h4>[\s\S]*?<\/div><\/div>/;
  nextMarkup = nextMarkup.replace(
    phoneCardPattern,
    `<div class="c-card"><div class="c-icon"><i class="fa fa-phone"></i></div><div class="c-text"><h4>Call Us</h4>${buildContactPhoneMarkup(settings.whatsapp_number)}</div></div>`,
  );

  return nextMarkup;
}

const courseCardColors = ["#1B2E6B", "#1D9E75", "#D85A30", "#7F77DD", "#BA7517", "#378ADD"];
const courseCardBadges = [
  { label: "POPULAR", style: "background:#EEF6FF;color:#1B2E6B" },
  { label: "HOT", style: "background:#E1F5EE;color:#0F6E56" },
  { label: "PREMIUM", style: "background:#FAECE7;color:#993C1D" },
  { label: "NEW", style: "background:#FAEEDA;color:#633806" },
];

function courseIconClass(type: string): string {
  if (type === "pdf") return "fa-file-pdf";
  if (type === "live") return "fa-video";
  return "fa-graduation-cap";
}

export function buildTopCoursesMarkup(courses: HomeTopCourse[]): string {
  if (!courses.length) return "";

  return courses
    .map((course, index) => {
      const badge = course.is_featured ? courseCardBadges[index % courseCardBadges.length] : null;
      const priceLabel = course.effective_price <= 0 ? "Free" : `₹${course.effective_price.toLocaleString("en-IN")}`;
      const description = escapeHtml((course.short_description || "Expert-designed banking exam course.").slice(0, 110));
      const thumb = course.image_url
        ? `<div class="course-thumb">${badge ? `<span class="course-badge" style="${badge.style}">${badge.label}</span>` : ""}<img src="${escapeHtml(course.image_url)}" alt="${escapeHtml(course.title)}"></div>`
        : `<div class="course-thumb course-thumb-fallback" style="background:${courseCardColors[index % courseCardColors.length]}">${badge ? `<span class="course-badge" style="${badge.style}">${badge.label}</span>` : ""}<i class="fa ${courseIconClass(course.course_type)}"></i></div>`;

      return `<a href="/courses/${escapeHtml(course.slug)}" class="course-card">
      ${thumb}
      <div class="course-top">
        <div class="course-title">${escapeHtml(course.title)}</div>
        <div class="course-desc">${description}</div>
      </div>
      <div class="course-bottom">
        <div class="course-meta"><span><i class="fa fa-clock"></i> ${course.duration_hours} hrs</span><span><i class="fa fa-file-alt"></i> ${course.lessons_count}+ Lessons</span></div>
        <div class="course-price">${priceLabel}</div>
      </div>
    </a>`;
    })
    .join("");
}

export function applyTopCoursesMarkup(markup: string, courses: HomeTopCourse[]): string {
  const cards = buildTopCoursesMarkup(courses);
  if (!cards) return markup;

  return markup.replace(/<div class="courses-grid">[\s\S]*?<\/div>(?=\s*<\/section>)/, `<div class="courses-grid">${cards}</div>`);
}

export function buildHeroShowcaseMarkup(bannerImages: string[]): string {
  const bannerMarkup = buildBannerSliderMarkup(bannerImages);

  return `<div class="hero-showcase-stack">
  <div class="hero-quick-grid">
    <div class="hero-quick-card">
      <h3>Popular Products</h3>
      <div class="hero-icon-row">
        <a href="/courses" class="hero-product"><span class="hero-product-icon orange"><i class="fa fa-file-pdf"></i></span><b>PDF Course</b></a>
        <a href="/mock-tests" class="hero-product"><span class="hero-product-icon violet"><i class="fa fa-clipboard-check"></i></span><b>Mock Tests</b></a>
        <a href="/courses" class="hero-product"><span class="hero-product-icon purple"><i class="fa fa-crown"></i></span><b>GOAT</b></a>
        <a href="/courses" class="hero-product"><span class="hero-product-icon teal"><i class="fa fa-file-lines"></i></span><b>Super Plan</b></a>
      </div>
    </div>
    <div class="hero-quick-card">
      <h3>Imp Materials</h3>
      <div class="hero-icon-row">
        <a href="/mock-tests" class="hero-product"><span class="hero-product-icon pink"><i class="fa fa-gift"></i></span><b>Smart Quiz</b></a>
        <a href="/courses" class="hero-product"><span class="hero-product-icon teal"><i class="fa fa-book-open"></i></span><b>Study Notes</b></a>
        <a href="/mock-tests" class="hero-product"><span class="hero-product-icon violet"><i class="fa fa-clipboard-list"></i></span><b>Live Test</b></a>
        <a href="/courses" class="hero-product"><span class="hero-product-icon red"><i class="fa fa-file-arrow-down"></i></span><b>Free PDF</b></a>
      </div>
    </div>
  </div>
  ${bannerMarkup || `<div class="hero-admin-ad-slider" aria-label="Admin advertisement banner">
    <div class="hero-ad-track">
      <a href="/courses" class="hero-ad-slide">
        <span>Admin Ad Banner</span>
        <strong>Bank Foundation Batch 2026</strong>
        <em>Promote courses, offers, events and live batches from admin panel.</em>
        <b>Explore Now</b>
      </a>
      <a href="/mock-tests" class="hero-ad-slide alt">
        <span>Mock Test Offer</span>
        <strong>Practice Like Real Exam</strong>
        <em>Add discount banners, test series ads and limited-time offers here.</em>
        <b>Start Test</b>
      </a>
      <a href="/live-classes" class="hero-ad-slide dark">
        <span>Live Class Update</span>
        <strong>Daily Banking Classes</strong>
        <em>Use this space for announcement banners and upcoming class schedules.</em>
        <b>Join Class</b>
      </a>
    </div>
  </div>`}
  <div class="hero-bottom-grid">
    <div class="hero-exams-card">
      <div class="hero-card-head"><h3>Upcoming Exams</h3><a href="/mock-tests">View More</a></div>
      <div class="hero-exam-list">
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon bank">RBI</span><b>RBI Assistant</b></a>
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon office">RBI</span><b>RBI Office</b></a>
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon sbi">SBI</span><b>SBI PO</b></a>
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon ibps">IBPS</span><b>IBPS PO</b></a>
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon sbi">SBI</span><b>SBI Clerk</b></a>
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon ibps">IBPS</span><b>IBPS Clerk</b></a>
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon bank">RRB</span><b>IBPS RRB</b></a>
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon office">OICL</span><b>OICL AO</b></a>
      </div>
    </div>
    <a href="/courses" class="hero-banner-card">
      <span>Bank Foundation Batch 2026</span>
      <strong>Har Ghar Banker</strong>
      <em>One access. Unlimited prep.</em>
      <b>₹1399</b>
    </a>
  </div>
</div>`;
}
