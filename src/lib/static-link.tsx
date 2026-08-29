"use client";

import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { normalizeStaticHref } from "@/lib/static-nav";

type Href = string | { pathname?: string; query?: Record<string, string | number | undefined>; hash?: string };

type StaticLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: Href;
  children?: ReactNode;
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  locale?: string | false;
  passHref?: boolean;
  legacyBehavior?: boolean;
};

function hrefToString(href: Href): string {
  if (typeof href === "string") return href;
  const path = href.pathname || "/";
  const query = href.query
    ? Object.fromEntries(
        Object.entries(href.query)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)]),
      )
    : {};
  const search = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : "";
  const hash = href.hash ? `#${String(href.hash).replace(/^#/, "")}` : "";
  return `${path}${search}${hash}`;
}

const Link = forwardRef<HTMLAnchorElement, StaticLinkProps>(function StaticLink(
  { href, prefetch, replace, scroll, shallow, locale, passHref, legacyBehavior, ...rest },
  ref,
) {
  return <a ref={ref} href={normalizeStaticHref(hrefToString(href))} {...rest} />;
});

export default Link;
