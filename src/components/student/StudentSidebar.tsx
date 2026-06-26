"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Gift,
  Grid2X2,
  Headphones,
  History,
  LogOut,
  ShoppingBag,
  StickyNote,
  Target,
  User,
  WalletCards,
} from "lucide-react";
import { BRAND_LOGO_ALT, BRAND_LOGO_SRC } from "@/lib/brand";
import { logoutStudent } from "@/lib/student-auth";

const navGroups = [
  {
    title: "Learn",
    items: [
      { label: "Dashboard", icon: Grid2X2, href: "/student/dashboard" },
      { label: "My Courses", icon: BookOpen, href: "/student/courses" },
      { label: "Mock Tests", icon: WalletCards, href: "/student/mock-tests" },
      { label: "My Notes", icon: StickyNote, href: "/student/notes" },
      { label: "Test Results", icon: Target, href: "/student/test-results" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "My Profile", icon: User, href: "/student/profile" },
      { label: "Purchase History", icon: ShoppingBag, href: "/student/purchases" },
      { label: "Order History", icon: History, href: "/student/orders" },
      { label: "Refer & Earn", icon: Gift, href: "/student/refer-earn" },
      { label: "DRS Ticket", icon: Headphones, href: "/student/drs-ticket" },
    ],
  },
];

function isNavItemActive(pathname: string, href: string) {
  if (href === "/student/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

type StudentSidebarProps = {
  onNavigate?: () => void;
};

export function StudentSidebar({ onNavigate }: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    logoutStudent();
    router.push("/login");
  };

  return (
    <>
      <div className="flex h-[78px] items-center gap-3 border-b border-[#e4e8f1] px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 transition hover:opacity-90" onClick={onNavigate}>
          <Image
            src={BRAND_LOGO_SRC}
            alt={BRAND_LOGO_ALT}
            width={160}
            height={48}
            className="h-11 w-auto object-contain"
          />
          <div className="min-w-0">
            <p className="text-sm font-extrabold leading-tight text-[#7c3aed]">KR Logics</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7c3aed]/60">Student LMS</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-8">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9aa4b5]">{group.title}</p>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const active = isNavItemActive(pathname, item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex h-10 items-center gap-3 rounded-2xl px-3.5 text-[13px] font-semibold transition ${
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

      <div className="border-t border-[#e4e8f1] bg-white p-4">
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
