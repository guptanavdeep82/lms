import type { ReactNode } from "react";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import type { HomePageSettings } from "@/lib/home-page";

type PublicPageShellProps = {
  active?: "home" | "courses" | "packages" | "mock-tests" | "faculty" | "contact" | "live-classes";
  children: ReactNode;
  className?: string;
  footerSettings?: HomePageSettings | null;
};

export function PublicPageShell({
  active,
  children,
  className = "min-h-screen bg-[#f8f9fc] text-slate-950",
  footerSettings,
}: PublicPageShellProps) {
  return (
    <>
      <PublicHeader active={active} />
      <main className={className}>{children}</main>
      <PublicFooter settings={footerSettings} />
    </>
  );
}
