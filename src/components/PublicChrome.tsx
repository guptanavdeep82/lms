"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicChatWidget } from "@/components/chatbot/PublicChatWidget";
import { HomeWelcomePopup } from "@/components/home/HomeWelcomePopup";
import type { CmsPageSummary } from "@/lib/cms-pages";
import type { HomePageSettings } from "@/lib/home-page";

type PublicChromeProps = {
  children: ReactNode;
  footerSettings?: HomePageSettings | null;
  headerPages?: CmsPageSummary[];
};

function hidePublicChrome(pathname: string) {
  return pathname.startsWith("/student") || pathname.startsWith("/admin") || pathname.startsWith("/app-google-auth");
}

export function PublicChrome({
  children,
  footerSettings = null,
  headerPages = [],
}: PublicChromeProps) {
  const pathname = usePathname() || "/";

  if (hidePublicChrome(pathname)) {
    return children;
  }

  return (
    <>
      <PublicHeader pages={headerPages} />
      <HomeWelcomePopup settings={footerSettings} />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <PublicFooter settings={footerSettings} />
      <PublicChatWidget />
    </>
  );
}
