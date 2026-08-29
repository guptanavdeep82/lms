export function normalizeStaticHref(href: string): string {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
  if (/^https?:/i.test(href)) return href;

  try {
    const url = new URL(href, "https://static.local");
    if (!url.pathname.endsWith("/") && !/\.[a-z0-9]{1,8}$/i.test(url.pathname)) {
      url.pathname += "/";
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

export function staticPush(href: string) {
  if (typeof window === "undefined") return;
  window.location.assign(normalizeStaticHref(href));
}

export function staticReplace(href: string) {
  if (typeof window === "undefined") return;
  window.location.replace(normalizeStaticHref(href));
}
