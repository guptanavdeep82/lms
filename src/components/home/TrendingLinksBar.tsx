"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultHomePageSettings, fetchHomePageData, type HomeTrendingLink } from "@/lib/home-page";
import { normalizeStaticHref } from "@/lib/static-nav";

function linkHref(url: string) {
  if (/^https?:\/\//i.test(url) || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url;
  }

  return normalizeStaticHref(url);
}

export function TrendingLinksBar() {
  const [links, setLinks] = useState<HomeTrendingLink[]>(defaultHomePageSettings.trending_links);

  useEffect(() => {
    let mounted = true;

    fetchHomePageData().then((data) => {
      if (!mounted) return;
      const nextLinks = data?.settings.trending_links ?? [];
      if (nextLinks.length) setLinks(nextLinks);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const height = links.length ? "42px" : "0px";
    document.documentElement.style.setProperty("--public-trending-height", height);

    return () => {
      document.documentElement.style.removeProperty("--public-trending-height");
    };
  }, [links.length]);

  const groupLinks = useMemo(() => {
    if (!links.length) return [];
    const repeats = Math.max(4, Math.ceil(16 / links.length));
    return Array.from({ length: repeats }, () => links).flat();
  }, [links]);

  if (!links.length) return null;

  return (
    <section className="public-trending-strip" aria-label="Trending links">
      <strong>Trending Links:</strong>
      <div className="public-trending-marquee">
        <div className="public-trending-track">
          {[0, 1].map((copy) => (
            <div className="public-trending-group" key={copy} aria-hidden={copy === 1}>
              {groupLinks.map((link, index) => (
                <a key={`${copy}-${link.label}-${index}`} href={linkHref(link.url)}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
