"use client";

import { Fragment, type ReactNode } from "react";
import { siteOrigin } from "@/lib/site-url";

type ChatMessageContentProps = {
  content: string;
  className?: string;
};

function toAbsoluteUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `${siteOrigin()}${trimmed}`;
  return trimmed;
}

function linkLabel(url: string): string {
  return url;
}

/**
 * Renders chatbot text with markdown links and bare URLs as full clickable links
 * that open in a new tab.
 */
export function ChatMessageContent({ content, className }: ChatMessageContentProps) {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s<]+)|(\/(?:courses|mock-tests|faq|contact|login|register|packages|faculty|notes|live-classes|pricing|blog|forum)[^\s<]*)/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={`t-${key++}`}>{content.slice(lastIndex, match.index)}</Fragment>);
    }

    if (match[1] && match[2]) {
      const href = toAbsoluteUrl(match[2]);
      nodes.push(
        <a
          key={`a-${key++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="kr-chat-link"
        >
          {linkLabel(href)}
        </a>,
      );
    } else {
      const raw = match[3] || match[4] || "";
      const href = toAbsoluteUrl(raw);
      nodes.push(
        <a
          key={`a-${key++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="kr-chat-link"
        >
          {linkLabel(href)}
        </a>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    nodes.push(<Fragment key={`t-${key++}`}>{content.slice(lastIndex)}</Fragment>);
  }

  return <span className={className}>{nodes.length ? nodes : content}</span>;
}
