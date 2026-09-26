"use client";

import { Bell, Menu } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { staticReplace } from "@/lib/static-nav";
import { BookmarksProvider } from "@/components/student/BookmarksProvider";
import { StudentMobileNav } from "@/components/student/StudentMobileNav";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { getStudentSession, isStudentLoggedIn, logoutStudent } from "@/lib/student-auth";
import {
  attachStudentDeviceSession,
  validateStudentDeviceSession,
} from "@/lib/student-session";
import { studentInitials } from "@/lib/student-dashboard";

const SESSION_VALIDATE_MS = 30_000;

type StudentDashboardShellProps = {
  children: ReactNode;
};

export function StudentDashboardShell({ children }: StudentDashboardShellProps) {
  const [initials, setInitials] = useState("ST");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const validatingRef = useRef(false);

  const kickToLogin = useCallback((reason?: "another_device") => {
    logoutStudent();
    const redirect = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
    const kicked = reason === "another_device" ? "&kicked=1" : "";
    staticReplace(`/login?redirect=${redirect}${kicked}`);
  }, []);

  const runSessionCheck = useCallback(async () => {
    if (validatingRef.current) return;
    validatingRef.current = true;
    try {
      let session = getStudentSession();
      if (!session) {
        kickToLogin();
        return;
      }

      if (!session.sessionToken || !session.deviceId) {
        session = (await attachStudentDeviceSession(session)) || session;
      }

      if (session.sessionToken && session.deviceId) {
        const valid = await validateStudentDeviceSession();
        if (!valid) {
          kickToLogin("another_device");
          return;
        }
      }

      setSessionReady(true);
      if (session.name) setInitials(studentInitials(session.name));
    } catch {
      // Network blips should not force logout; retry on next interval/focus.
      setSessionReady(true);
    } finally {
      validatingRef.current = false;
    }
  }, [kickToLogin]);

  useEffect(() => {
    if (!isStudentLoggedIn()) {
      kickToLogin();
      return;
    }

    void runSessionCheck();

    const intervalId = window.setInterval(() => {
      void runSessionCheck();
    }, SESSION_VALIDATE_MS);

    const onFocus = () => {
      if (document.visibilityState === "hidden") return;
      void runSessionCheck();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [kickToLogin, runSessionCheck]);

  if (!sessionReady && !isStudentLoggedIn()) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[13px] text-[#111827] sm:text-sm" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
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
        <div className="mx-auto max-w-[1320px] px-4 py-7 sm:px-8">
          <BookmarksProvider>{children}</BookmarksProvider>
        </div>
      </section>
    </main>
  );
}
