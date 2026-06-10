import {
  formatCompactStat,
  formatStatNumber,
  extractYouTubeId,
  type HomePageFaculty,
  type HomePageFaq,
  type HomePageReview,
  type HomePageSettings,
} from "@/lib/home-page";

const facultyColors = ["#1B2E6B", "#15803D", "#185FA5", "#D85A30", "#7F77DD", "#BA7517"];
const facultyBackgrounds = ["var(--light2)", "#F0FDF4", "#EEF6FF", "#FFF7ED", "#F5F3FF", "#FFF8EB"];

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "KR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function buildStars(rating: number): string {
  return Array.from({ length: 5 }, (_, index) =>
    `<i class="fa fa-star"${index < rating ? "" : ' style="opacity:.25"'}></i>`,
  ).join("");
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

export function buildFacultyGridMarkup(faculties: HomePageFaculty[]): string {
  if (faculties.length === 0) return "";

  return faculties
    .map((faculty, index) => {
      const color = facultyColors[index % facultyColors.length];
      const background = facultyBackgrounds[index % facultyBackgrounds.length];
      const initials = initialsFromName(faculty.title);
      const avatarMarkup = faculty.image_url
        ? `<img class="faculty-avatar-img" src="${escapeHtml(faculty.image_url)}" alt="${escapeHtml(faculty.title)}" />`
        : `<div class="faculty-avatar" style="background:${color}">${escapeHtml(initials)}</div>`;
      const chips = faculty.course_keywords
        .map((keyword) => `<span class="fchip">${escapeHtml(keyword)}</span>`)
        .join("");
      const experience = faculty.experience?.trim() ? escapeHtml(faculty.experience) : "Experienced mentor";

      return `<div class="faculty-card">
      <div class="faculty-top" style="background:${background}">${avatarMarkup}</div>
      <div class="faculty-body"><div class="faculty-name">${escapeHtml(faculty.title)}</div><div class="faculty-role">${escapeHtml(faculty.designation)}</div><div class="faculty-exp">${experience}</div><div class="faculty-chips">${chips}</div></div>
    </div>`;
    })
    .join("");
}

export function buildReviewsGridMarkup(reviews: HomePageReview[]): string {
  if (reviews.length === 0) return "";

  return reviews
    .map((review, index) => {
      const color = facultyColors[index % facultyColors.length];
      const initials = initialsFromName(review.name);
      const authorVisual = review.image_url
        ? `<img class="testi-avatar-img" src="${escapeHtml(review.image_url)}" alt="${escapeHtml(review.name)}" />`
        : `<div class="testi-avatar" style="background:${color}">${escapeHtml(initials)}</div>`;
      const examName = review.exam_name?.trim() ? escapeHtml(review.exam_name) : "KR Logics Student";

      return `<div class="testi-card">
      <div class="testi-stars">${buildStars(review.rating)}</div>
      <div class="testi-text">"${escapeHtml(review.description)}"</div>
      <div class="testi-author">
        ${authorVisual}
        <div><div class="testi-name">${escapeHtml(review.name)}</div><div class="testi-bank">${examName}</div></div>
      </div>
    </div>`;
    })
    .join("");
}

export function buildFaqMarkup(faqs: HomePageFaq[]): string {
  if (faqs.length === 0) return "";

  return faqs
    .map(
      (faq, index) => `<div class="faq-item${index === 0 ? " open" : ""}">
      <div class="faq-q">${escapeHtml(faq.question)}<span class="faq-toggle"><i class="fa fa-plus"></i></span></div>
      <div class="faq-ans"><p>${escapeHtml(faq.answer)}</p></div>
    </div>`,
    )
    .join("");
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

export function applyHomePageData(markup: string, settings: HomePageSettings, faculties: HomePageFaculty[], reviews: HomePageReview[], faqs: HomePageFaq[]): string {
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

  const facultyGrid = buildFacultyGridMarkup(faculties);
  if (facultyGrid) {
    nextMarkup = nextMarkup.replace(
      /<div class="faculty-grid">[\s\S]*<\/div>(?=\s*<\/section>\s*\n\n<div class="divider">)/,
      `<div class="faculty-grid">${facultyGrid}</div>`,
    );
  }

  const reviewsGrid = buildReviewsGridMarkup(reviews);
  if (reviewsGrid) {
    nextMarkup = nextMarkup.replace(
      /<div class="testi-grid">[\s\S]*<\/div>(?=\s*<\/section>\s*\n\n<!-- FAQ -->)/,
      `<div class="testi-grid">${reviewsGrid}</div>`,
    );
  }

  const faqItems = buildFaqMarkup(faqs);
  if (faqItems) {
    nextMarkup = nextMarkup.replace(
      /<div class="faq-wrap">[\s\S]*<\/div>(?=\s*<\/section>\s*\n\n<div class="divider">)/,
      `<div class="faq-wrap">${faqItems}</div>`,
    );
  }

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
