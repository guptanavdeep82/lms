import { decodeHtmlEntities, looksLikeHtml } from "@/lib/html-entities";
import { publicBackendBaseUrl } from "@/lib/mock-tests";

function rewriteMediaUrls(html: string): string {
  const base = publicBackendBaseUrl.replace(/\/+$/, "");

  return html.replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'])/gi, (_full, prefix: string, src: string, suffix: string) => {
    const decoded = src.trim();
    if (/^https?:\/\//i.test(decoded)) {
      try {
        const url = new URL(decoded);
        if (url.pathname.startsWith("/uploads/") || url.pathname.startsWith("/storage/")) {
          return `${prefix}${base}${url.pathname}${suffix}`;
        }
      } catch {
        /* keep original */
      }
      return `${prefix}${decoded}${suffix}`;
    }
    if (decoded.startsWith("//")) {
      return `${prefix}https:${decoded}${suffix}`;
    }
    if (decoded.startsWith("/")) {
      return `${prefix}${base}${decoded}${suffix}`;
    }
    return `${prefix}${decoded}${suffix}`;
  });
}

export function RichHtml({
  html,
  className,
}: {
  html: string | null | undefined;
  className?: string;
}) {
  const value = html ?? "";
  if (!value) return null;

  if (looksLikeHtml(value)) {
    return (
      <div
        className={`exam-rich-html ${className ?? ""}`.trim()}
        dangerouslySetInnerHTML={{ __html: rewriteMediaUrls(value) }}
      />
    );
  }

  return <span className={className}>{decodeHtmlEntities(value)}</span>;
}
