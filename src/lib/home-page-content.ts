import {
  formatCompactStat,
  formatStatNumber,
  extractYouTubeId,
  type HomeBanner,
  type HomeCategoryChip,
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
  if (/^(fa-solid|fa-regular|fa-brands|fas|far|fab)\s/.test(value)) return value;
  if (value.startsWith("fa ")) return value.replace(/^fa\s+/, "fa-solid ");
  if (value.startsWith("fa-")) return `fa-solid ${value}`;
  return `fa-solid fa-${value}`;
}

function relevantChipIcon(title: string, fallback?: string | null): string {
  const name = title.toLowerCase();
  if (name.includes("elite") || name.includes("pass")) return "fa-solid fa-crown";
  if (name.includes("english")) return "fa-solid fa-book-open";
  if (name.includes("aptitude") || name.includes("quant")) return "fa-solid fa-calculator";
  if (name.includes("jaiib") || name.includes("tamil")) return "fa-solid fa-graduation-cap";
  if (name.includes("reason")) return "fa-solid fa-brain";
  if (name.includes("awareness")) return "fa-solid fa-building-columns";
  if (name.includes("ssc")) return "fa-solid fa-pen-fancy";
  if (name.includes("rail")) return "fa-solid fa-train";
  if (name.includes("teach")) return "fa-solid fa-chalkboard-user";
  if (name.includes("upsc")) return "fa-solid fa-landmark";
  if (name.includes("state")) return "fa-solid fa-map-location-dot";
  if (name.includes("bank")) return "fa-solid fa-building-columns";
  return faIconClass(fallback);
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

export function buildCategoryChipsMarkup(chips: HomeCategoryChip[]): string {
  if (!chips.length) return "";

  const items = chips
    .map((chip, index) => {
      const visual = `<span class="cat-ic c${(index % 6) + 1}"><i class="${relevantChipIcon(chip.title, chip.icon)}"></i></span>`;

      return `<a href="${escapeHtml(chip.url || "/courses")}" class="cat-chip">
    ${visual}
    <span class="cat-chip-meta"><b>${escapeHtml(chip.title)}</b>${chip.subtitle?.trim() ? `<small>${escapeHtml(chip.subtitle)}</small>` : ""}</span>
  </a>`;
    })
    .join("\n  ");

  return `<section class="cat-strip" id="categories" aria-label="Explore exam categories">
  ${items}
</section>`;
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

  return stats ? `<section class="achieve-strip">${stats}</section>` : "";
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
    /<div>\s*<div class="sec-eyebrow">About Us<\/div>[\s\S]*?<\/section>/,
    `${buildAboutContentMarkup(settings)}\n  </div>\n</section>`,
  );
  nextMarkup = nextMarkup.replace(
    /<div style="font-family:'Sora',sans-serif;font-size:30px;font-weight:800;color:var\(--navy\)">850\+<\/div>/,
    buildSelectionsMiniCardMarkup(settings),
  );
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

export function buildHeroShowcaseMarkup(banners: HomeBanner[] | string[], settings?: HomePageSettings | null): string {
  const defaultBanners: HomeBanner[] = [
    { image_url: "/hero-banner.png", url: null },
    { image_url: "/hero-banner-2.png", url: null },
  ];
  const items: HomeBanner[] = banners.length
    ? banners.map((banner) => (typeof banner === "string" ? { image_url: banner, url: null } : banner))
    : (settings?.banners?.length ? settings.banners : defaultBanners);
  const slides = items
    .map((banner, index) => {
      const image = `<img src="${escapeHtml(banner.image_url)}" alt="Banking exam promotional banner" loading="${index === 0 ? "eager" : "lazy"}" />`;
      const className = `hero-ref-slide${index === 0 ? " active" : ""}`;
      const href = banner.url?.trim();

      if (!href) {
        return `<div class="${className}">${image}</div>`;
      }

      const isExternal = /^https?:\/\//i.test(href);
      const extra = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escapeHtml(href)}" class="${className}"${extra}>${image}</a>`;
    })
    .join("");
  const dots = items
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
