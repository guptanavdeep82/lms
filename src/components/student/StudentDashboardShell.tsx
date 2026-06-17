"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { StudentMobileNav } from "@/components/student/StudentMobileNav";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";
import { studentInitials } from "@/lib/student-dashboard";

type StudentDashboardShellProps = {
  children: ReactNode;
};

export function StudentDashboardShell({ children }: StudentDashboardShellProps) {
  const router = useRouter();
  const [initials, setInitials] = useState("ST");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isStudentLoggedIn()) {
      const redirect = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
      router.replace(`/login?redirect=${redirect}`);
      return;
    }
    const session = getStudentSession();
    if (session?.name) setInitials(studentInitials(session.name));
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {sidebarOpen ? (
        <button type="button" className="fixed inset-0 z-40 bg-black/40 lg:hidden" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />
      ) : null}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[282px] flex-col border-r border-[#e4e8f1] bg-white transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <StudentSidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      <section className="min-w-0 lg:pl-[282px]">
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-[#e4e8f1] bg-white/88 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-2xl border border-[#e4e8f1] bg-white text-[#334155] shadow-sm lg:hidden"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            <div className="hidden h-11 w-[480px] items-center gap-3 rounded-2xl border border-[#e4e8f1] bg-[#f8fafc] px-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:flex">
              <Search size={18} className="text-[#7d8799]" />
              <span className="text-sm font-medium text-[#7d8799]">Search courses, mock tests, notes...</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[#e4e8f1] bg-white text-[#172a69] shadow-sm">
              <Bell size={19} />
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#f5c518] ring-2 ring-white" />
            </button>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#172a69] text-sm font-extrabold text-white">{initials}</div>
          </div>
        </header>

        <StudentMobileNav />
        <div className="mx-auto max-w-[1320px] px-4 py-7 sm:px-8">{children}</div>
      </section>
    </main>
  );
}
