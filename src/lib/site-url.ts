export function siteOrigin() {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://krlogics.com").trim();
  return fromEnv.replace(/\/+$/, "");
}

export function siteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return `${siteOrigin()}/`;
  }

  return `${siteOrigin()}${normalized.replace(/\/+$/, "")}/`;
}
