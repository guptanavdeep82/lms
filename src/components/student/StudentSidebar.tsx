"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  CreditCard,
  Grid2X2,
  LogOut,
  Medal,
  MessageSquare,
  Settings,
  User,
  WalletCards,
} from "lucide-react";
import { logoutStudent } from "@/lib/student-auth";

const navGroups = [
  {
    title: "Learn",
    items: [
      { label: "Dashboard", icon: Grid2X2, href: "/student/dashboard" },
      { label: "My Courses", icon: BookOpen, href: "/student/courses" },
      { label: "Mock Tests", icon: WalletCards, href: "/student/mock-tests" },
      { label: "Schedule", icon: CalendarDays, href: "#schedule" },
      { label: "Certificates", icon: Medal, href: "#certificates" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", icon: User, href: "#profile" },
      { label: "Purchases", icon: CreditCard, href: "#purchases" },
      { label: "Messages", icon: MessageSquare, href: "#messages" },
      { label: "Settings", icon: Settings, href: "#settings" },
    ],
  },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    logoutStudent();
    router.push("/login");
  };

  return (
    <>
      <div className="flex h-[78px] items-center gap-3 border-b border-[#e4e8f1] px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 transition hover:opacity-90">
          <Image
            src="/logics-logo.jpeg"
            alt="KR Logics logo"
            width={48}
            height={48}
            className="h-12 w-12 rounded-2xl border-2 border-[#ffd21f] object-cover shadow-xl shadow-black/10"
          />
          <div className="min-w-0">
            <p className="text-[16px] font-extrabold leading-tight text-[#172a69]">KR Logics</p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#8791a5]">Student LMS</p>
          </div>
        </Link>
      </div>

      <div className="h-[calc(100vh-78px)] overflow-y-auto px-4 py-5 pb-24">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-8">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9aa4b5]">{group.title}</p>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex h-11 items-center gap-3 rounded-2xl px-3.5 text-[14px] font-semibold transition ${
                      active
                        ? "bg-[#eef2ff] text-[#172a69] shadow-sm ring-1 ring-[#dfe5ff]"
                        : "text-[#334155] hover:bg-[#f3f6fb] hover:text-[#172a69]"
                    }`}
                  >
                    <item.icon size={18} strokeWidth={2.2} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-[#e4e8f1] bg-white p-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-11 w-full items-center gap-3 rounded-2xl px-3.5 text-left text-[14px] font-semibold text-[#334155] transition hover:bg-[#f3f6fb]"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </>
  );
}

export function studentMobileNavItems() {
  return navGroups.flatMap((group) => group.items).slice(0, 6);
}
