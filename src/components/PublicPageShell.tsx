import type { ReactNode } from "react";

type PublicPageShellProps = {
  active?: "home" | "courses" | "packages" | "mock-tests" | "faculty" | "contact" | "live-classes" | "current-affairs" | "faq";
  children: ReactNode;
  className?: string;
  footerSettings?: unknown;
};

export function PublicPageShell({
  children,
  className = "min-h-screen bg-[#f8f9fc] text-slate-950",
}: PublicPageShellProps) {
  return <main className={className}>{children}</main>;
}
