import { decodeHtmlEntities, looksLikeHtml } from "@/lib/html-entities";

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
    return <div className={`exam-rich-html ${className ?? ""}`.trim()} dangerouslySetInnerHTML={{ __html: value }} />;
  }

  return <span className={className}>{decodeHtmlEntities(value)}</span>;
}
