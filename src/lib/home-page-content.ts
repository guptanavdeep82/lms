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
  const mockTests = formatStatNumber(settings.mock_tests) || "1000+";
  const liveClasses = formatStatNumber(settings.selections) || "500+";
  const videoLectures = formatStatNumber(settings.active_students) || "3000+";

  return `<div class="hero-stats">
        <div class="hstat"><span class="hstat-ic ic1"><i class="fa fa-file-lines"></i></span><div class="hstat-meta"><strong>${mockTests}</strong><small>Mock Tests</small></div></div>
        <div class="hstat"><span class="hstat-ic ic2"><i class="fa fa-video"></i></span><div class="hstat-meta"><strong>${liveClasses}</strong><small>Live Classes</small></div></div>
        <div class="hstat"><span class="hstat-ic ic3"><i class="fa fa-circle-play"></i></span><div class="hstat-meta"><strong>${videoLectures}</strong><small>Video Lectures</small></div></div>
        <div class="hstat"><span class="hstat-ic ic4"><i class="fa fa-headset"></i></span><div class="hstat-meta"><strong>24/7</strong><small>AI Doubt Support</small></div></div>
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

function courseIconClass(type: string): string {
  if (type === "pdf") return "fa-file-pdf";
  if (type === "live") return "fa-video";
  return "fa-graduation-cap";
}

export function buildTopCoursesMarkup(courses: HomeTopCourse[]): string {
  if (!courses.length) return "";

  return courses
    .map((course, index) => {
      const thumb = course.image_url
        ? `<div class="course-thumb"><img src="${escapeHtml(course.image_url)}" alt="${escapeHtml(course.title)}"></div>`
        : `<div class="course-thumb course-thumb-fallback" style="background:${courseCardColors[index % courseCardColors.length]}"><i class="fa ${courseIconClass(course.course_type)}"></i></div>`;

      return `<a href="/courses/${escapeHtml(course.slug)}" class="course-card course-card-thumb-only" aria-label="${escapeHtml(course.title)}">${thumb}</a>`;
    })
    .join("");
}

export function applyTopCoursesMarkup(markup: string, courses: HomeTopCourse[]): string {
  const cards = buildTopCoursesMarkup(courses);
  if (!cards) return markup;

  return markup.replace(/<div class="courses-grid">[\s\S]*?<\/div>(?=\s*<\/section>)/, `<div class="courses-grid">${cards}</div>`);
}

export function buildHeroShowcaseMarkup(bannerImages: string[]): string {
  const defaultBanners = ["/hero-banner.png", "/hero-banner-2.png"];
  const images = bannerImages.length > 0 ? bannerImages : defaultBanners;
  const slides = images
    .map(
      (image, index) =>
        `<div class="hero-ref-slide${index === 0 ? " active" : ""}"><img src="${escapeHtml(image)}" alt="Banking exam promotional banner" loading="${index === 0 ? "eager" : "lazy"}" /></div>`,
    )
    .join("");
  const dots = images
    .slice(0, 5)
    .map((_, index) => `<span${index === 0 ? ' class="active"' : ""}></span>`)
    .join("");

  return `<div class="hero-ref-wrap">
    <div class="hero-ref-banner">
      <div class="hero-ref-slides">${slides}</div>
      <div class="hero-ref-dots">${dots}</div>
      <button type="button" class="hero-ref-arrow left" aria-label="Previous banner"><i class="fa fa-chevron-left"></i></button>
      <button type="button" class="hero-ref-arrow right" aria-label="Next banner"><i class="fa fa-chevron-right"></i></button>
    </div>
    <div class="hero-ref-trust">
      <div class="hrt-head"><i class="fa fa-circle-check"></i> Trusted by aspirants across India</div>
      <div class="hrt-row">
        <div class="hrt-item"><span class="hrt-ic ic1"><i class="fa fa-star"></i></span><div class="hrt-meta"><strong>4.9/5</strong><small>Student Rating</small></div></div>
        <div class="hrt-item"><span class="hrt-ic ic2"><i class="fa fa-user-graduate"></i></span><div class="hrt-meta"><strong>50,000+</strong><small>Enrolled</small></div></div>
        <div class="hrt-item"><span class="hrt-ic ic3"><i class="fa fa-trophy"></i></span><div class="hrt-meta"><strong>5,000+</strong><small>Selections</small></div></div>
      </div>
    </div>
  </div>`;
}
