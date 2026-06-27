import {
  formatCompactStat,
  formatStatNumber,
  extractYouTubeId,
  type HomePageCategory,
  type HomePageSettings,
  type HomeTopCourse,
} from "@/lib/home-page";

function escapeHtml(value: string | null | undefined): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function faIconClass(icon: string | null | undefined): string {
  const value = String(icon ?? "fa-circle").trim();
  if (value.startsWith("fa ")) return value;
  if (value.startsWith("fa-")) return `fa ${value}`;
  return `fa fa-${value}`;
}

export function stripHeroLeftStats(markup: string): string {
  return markup.replace(
    /<div class="hero-stats">(?:\s*<div class="hstat">[\s\S]*?<\/div>){4}\s*<\/div>\s*(?=<\/div>\s*<div class="hero-right">)/,
    "",
  );
}

export function buildHeroStatsMarkup(settings?: HomePageSettings | null): string {
  const mockTests = settings ? formatStatNumber(settings.mock_tests) || "200+" : "200+";
  const liveClasses = settings ? formatStatNumber(settings.selections) || "850+" : "850+";
  const videoLectures = settings ? formatStatNumber(settings.active_students) || "12,501+" : "12,501+";

  return `<div class="hero-stats hero-ref-stats">
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

export function buildCategoryStripMarkup(categories: HomePageCategory[]): string {
  if (!categories.length) return "";

  const chips = categories
    .map((category, index) => {
      const countLabel = category.courses_count > 0 ? `${category.courses_count}+ Courses` : "Explore Courses";
      const visual = category.image_url
        ? `<span class="cat-img"><img src="${escapeHtml(category.image_url)}" alt="${escapeHtml(category.name)}" loading="lazy" /></span>`
        : `<span class="cat-ic c${(index % 6) + 1}"><i class="fa fa-layer-group"></i></span>`;

      return `<a href="/courses?category=${escapeHtml(category.slug)}" class="cat-chip">
    ${visual}
    <span class="cat-chip-meta"><b>${escapeHtml(category.name)}</b><small>${escapeHtml(countLabel)}</small></span>
  </a>`;
    })
    .join("\n  ");

  return `<section class="cat-strip" id="categories" aria-label="Explore exam categories">
  ${chips}
</section>`;
}

export function buildTrendingStripMarkup(links: HomePageSettings["trending_links"]): string {
  if (!links.length) return "";

  const trackItems = [...links, ...links]
    .map(
      (link) =>
        `<a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a><span>|</span>`,
    )
    .join("");

  return `<section class="trending-strip" aria-label="Trending links">
  <strong>Trending Links:</strong>
  <div class="trending-marquee">
    <div class="trending-track">${trackItems}</div>
  </div>
</section>`;
}

export function buildAchieveOfferMarkup(settings: HomePageSettings): string {
  const stats = settings.achievement_stats
    .map(
      (stat) =>
        `<div class="achieve-item"><span class="achieve-ic"><i class="${faIconClass(stat.icon)}"></i></span><div><strong>${escapeHtml(stat.value)}</strong><small>${escapeHtml(stat.label)}</small></div></div>`,
    )
    .join("");

  const achieveStrip = stats
    ? `<section class="achieve-strip">${stats}</section>`
    : "";

  if (!settings.offer_bar?.enabled) {
    return achieveStrip;
  }

  const offer = settings.offer_bar;
  const offerBar = `<section class="offer-bar">
  <div class="offer-left">
    <span class="offer-flame"><i class="fa fa-fire"></i> Limited Time Offer</span>
    <h3>${escapeHtml(offer.title)} <em>${escapeHtml(offer.highlight)}</em> ${escapeHtml(offer.suffix)}</h3>
    <p><i class="fa fa-clock"></i> ${escapeHtml(offer.description)}</p>
  </div>
  <div class="offer-timer">
    <div class="otile"><strong>02</strong><small>Days</small></div>
    <div class="otile"><strong>14</strong><small>Hours</small></div>
    <div class="otile"><strong>36</strong><small>Mins</small></div>
    <div class="otile"><strong>49</strong><small>Secs</small></div>
  </div>
  <div class="offer-right">
    <div class="offer-code"><small>Use Code:</small><b>${escapeHtml(offer.code)}</b></div>
    <a href="${escapeHtml(offer.btn_url)}" class="offer-btn">${escapeHtml(offer.btn_text)} <i class="fa fa-arrow-right"></i></a>
  </div>
</section>`;

  return `${achieveStrip}\n\n${offerBar}`;
}

export function buildWhyKrLogicsMarkup(settings: HomePageSettings): string {
  const section = settings.why_kr_logics;
  const cards = section.cards
    .map(
      (card) =>
        `<div class="why-kr-card">
      <div class="why-kr-icon"><i class="${faIconClass(card.icon)}"></i></div>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.description)}</p>
    </div>`,
    )
    .join("");

  return `<section class="why-kr-section">
  <div class="why-kr-head">
    <h2>${escapeHtml(section.title)}</h2>
    <p>${escapeHtml(section.description)}</p>
  </div>
  <div class="why-kr-grid">${cards}</div>
</section>`;
}

export function buildMockSectionMarkup(settings: HomePageSettings): string {
  const section = settings.mock_section;
  const optionLabels = ["A", "B", "C", "D"];
  const features = section.features
    .map(
      (feature) =>
        `<div class="mock-feat"><div class="mock-feat-icon"><i class="${faIconClass(feature.icon)}"></i></div><div><h4>${escapeHtml(feature.title)}</h4><p>${escapeHtml(feature.description)}</p></div></div>`,
    )
    .join("");
  const options = section.demo_options
    .map((option, index) => {
      const isCorrect = index === section.demo_correct_index;
      return `<div class="mock-opt${isCorrect ? " correct" : ""}"><span class="opt-circle">${optionLabels[index] || index + 1}</span>${escapeHtml(option)}${isCorrect ? ' <i class="fa fa-check-circle" style="margin-left:auto;font-size:14px"></i>' : ""}</div>`;
    })
    .join("");

  return `<section class="mock-section" id="mock">
  <div class="mock-layout">
    <div>
      <div class="sec-eyebrow">${escapeHtml(section.eyebrow)}</div>
      <h2 class="sec-title">${section.title ?? ""}</h2>
      <p style="font-size:15px;color:var(--gray);line-height:1.8">${escapeHtml(section.description)}</p>
      <div class="mock-feat-list">${features}</div>
      <a href="${escapeHtml(section.cta_url)}" class="mock-cta"><i class="fa fa-play-circle"></i> ${escapeHtml(section.cta_text)}</a>
    </div>
    <div>
      <div class="mock-ui">
        <div class="mock-header-bar">
          <div class="mock-exam-name">${escapeHtml(section.demo_exam_name)}</div>
          <div class="mock-timer">23:47</div>
        </div>
        <div class="mock-prog">
          <span class="done"></span><span class="done"></span><span class="done"></span><span class="cur"></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="mock-q-lbl">${escapeHtml(section.demo_section)}</div>
        <div class="mock-q-text">${escapeHtml(section.demo_question)}</div>
        <div class="mock-opts">${options}</div>
        <div class="mock-nav">
          <button class="prev">← Previous</button>
          <button class="next">Save &amp; Next →</button>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function buildHeroLeftContentMarkup(settings: HomePageSettings): string {
  return `<div class="hero-badge"><i class="fa fa-star"></i> ${escapeHtml(settings.hero_badge)}</div>
      <h1>${settings.hero_title ?? ""}</h1>
      <p class="hero-p">${escapeHtml(settings.hero_description)}</p>
      <div class="hero-btns">
        <a href="${escapeHtml(settings.hero_primary_btn_url)}" class="hero-btn-main">${escapeHtml(settings.hero_primary_btn_text)} <i class="fa fa-arrow-right"></i></a>
        <a href="${escapeHtml(settings.hero_secondary_btn_url)}" class="hero-btn-sec"><span class="play-circle"><i class="fa fa-play"></i></span><span class="play-text"><b>${escapeHtml(settings.hero_secondary_btn_text)}</b><small>${escapeHtml(settings.hero_secondary_btn_note)}</small></span></a>
      </div>`;
}

function buildAboutContentMarkup(settings: HomePageSettings): string {
  const about = settings.about_section;
  const points = about.points
    .map(
      (point) =>
        `<div class="a-pt"><div class="a-pt-icon"><i class="${faIconClass(point.icon)}"></i></div><div class="a-pt-body"><h4>${escapeHtml(point.title)}</h4><p>${escapeHtml(point.description)}</p></div></div>`,
    )
    .join("");

  return `<div class="about-content"><div class="sec-eyebrow">${escapeHtml(about.eyebrow)}</div>
      <h2 class="sec-title">${about.title ?? ""}</h2>
      <p style="font-size:15px;color:var(--gray);line-height:1.85;margin-bottom:30px">${escapeHtml(about.description)}</p>
      <div class="about-points">${points}</div></div>`;
}

function buildAboutCardMarkup(settings: HomePageSettings): string {
  const about = settings.about_section;

  return `<p style="font-size:14px;color:rgba(255,255,255,.65);line-height:1.8;margin-bottom:20px">${escapeHtml(about.card_description)}</p>`;
}

function buildAboutFloatMarkup(settings: HomePageSettings): string {
  const about = settings.about_section;

  return `<div class="about-float">
        <strong>${escapeHtml(about.badge_title)}</strong>
        <small>${escapeHtml(about.badge_subtitle)}</small>
      </div>`;
}

function buildContactSectionMarkup(settings: HomePageSettings): string {
  const contact = settings.contact_section;

  return `<section class="contact-section" id="contact">
  <div class="sec-eyebrow">Get In Touch</div>
  <h2 class="sec-title">Contact Us</h2>
  <div class="contact-grid">
    <div>
      <p style="font-size:15px;color:var(--gray);line-height:1.8;margin-bottom:26px">${escapeHtml(contact.intro)}</p>
      <div class="c-card-list">
        <div class="c-card"><div class="c-icon"><i class="fa fa-map-marker-alt"></i></div><div class="c-text"><h4>Our Location</h4><p>${contact.address}</p></div></div>
        <div class="c-card"><div class="c-icon"><i class="fa fa-phone"></i></div><div class="c-text"><h4>Call Us</h4>${buildContactPhoneMarkup(settings.whatsapp_number)}</div></div>
        <div class="c-card"><div class="c-icon"><i class="fa fa-envelope"></i></div><div class="c-text"><h4>Email Us</h4><p>${contact.email}</p></div></div>
        <div class="c-card"><div class="c-icon"><i class="fa fa-clock"></i></div><div class="c-text"><h4>Working Hours</h4><p>${contact.hours}</p></div></div>
      </div>
    </div>
    <div class="contact-form-box">
      <div class="cf-title">${escapeHtml(contact.form_title)}</div>
      <div class="form-row">
        <div class="form-field"><label>Full Name</label><input type="text" placeholder="Your full name"></div>
        <div class="form-field"><label>Phone Number</label><input type="text" placeholder="+91 XXXXX XXXXX"></div>
      </div>
      <div class="form-field"><label>Email Address</label><input type="email" placeholder="your@email.com"></div>
      <div class="form-field"><label>Interested In</label>
        <select>
          <option>Select a course</option>
          <option>IBPS PO Complete Course</option>
          <option>SBI PO / Clerk Course</option>
          <option>RBI Grade B Preparation</option>
          <option>Insurance Exams</option>
          <option>Mock Test Series Only</option>
        </select>
      </div>
      <div class="form-field"><label>Message</label><textarea placeholder="Tell us how we can help..."></textarea></div>
      <button class="cf-submit"><i class="fa fa-paper-plane"></i> Send Message</button>
    </div>
  </div>
</section>`;
}

export function applyHomePageData(markup: string, settings: HomePageSettings): string {
  let nextMarkup = markup;

  nextMarkup = stripHeroLeftStats(nextMarkup);
  nextMarkup = nextMarkup.replace(
    /(<div class="hero-left">\s*)[\s\S]*?(\s*<\/div>\s*<div class="hero-right">)/,
    `$1${buildHeroLeftContentMarkup(settings)}$2`,
  );
  nextMarkup = nextMarkup.replace(
    /<div class="about-stat-row">(?:\s*<div class="about-stat-box">[\s\S]*?<\/div>){3}\s*<\/div>/,
    buildAboutStatsMarkup(settings),
  );
  nextMarkup = nextMarkup.replace(
    /<p style="font-size:14px;color:rgba\(255,255,255,.65\)[^"]*">[\s\S]*?<\/p>/,
    buildAboutCardMarkup(settings),
  );
  nextMarkup = nextMarkup.replace(/<div class="about-float">[\s\S]*?<\/div>/, buildAboutFloatMarkup(settings));
  nextMarkup = nextMarkup.replace(
    /(<section class="about-section" id="about">[\s\S]*?<div style="position:relative">[\s\S]*?<\/div>\s*)<div>(\s*<div class="sec-eyebrow">About Us)/,
    `$1${buildAboutContentMarkup(settings)}`,
  );
  nextMarkup = nextMarkup.replace(
    /<div style="font-family:'Sora',sans-serif;font-size:30px;font-weight:800;color:var\(--navy\)">850\+<\/div>/,
    buildSelectionsMiniCardMarkup(settings),
  );
  nextMarkup = nextMarkup.replace(/<section class="mock-section" id="mock">[\s\S]*?<\/section>/, buildMockSectionMarkup(settings));
  nextMarkup = nextMarkup.replace(/<section class="contact-section" id="contact">[\s\S]*?<\/section>/, buildContactSectionMarkup(settings));

  nextMarkup = nextMarkup.replace(
    /<div class="footer-socials">[\s\S]*<\/div>(?=\s*<\/div>\s*<div class="footer-col">)/,
    buildFooterSocialsMarkup(settings),
  );

  return nextMarkup;
}

const courseCardColors = ["#0957D3", "#1D9E75", "#D85A30", "#7F77DD", "#BA7517", "#378ADD"];

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

export function buildHeroShowcaseMarkup(bannerImages: string[], settings?: HomePageSettings | null): string {
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
    ${buildHeroStatsMarkup(settings)}
  </div>`;
}
