"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { studentMobileNavItems } from "@/components/student/StudentSidebar";

export function StudentMobileNav() {
  const pathname = usePathname();
  const items = studentMobileNavItems();

  return (
    <nav className="sticky top-[70px] z-20 flex gap-2 overflow-x-auto border-b border-[#e4e8f1] bg-white px-4 py-3 [scrollbar-width:none] sm:px-8 lg:hidden [&::-webkit-scrollbar]:hidden">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-2xl px-3 text-xs font-extrabold ${
            pathname === item.href ? "bg-[#172a69] text-white" : "bg-[#f3f6fb] text-[#334155]"
          }`}
        >
          <item.icon size={15} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
