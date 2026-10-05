"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, CheckCircle2, Crown, Loader2, WalletCards } from "lucide-react";
import { fetchStudentLibrary, packageIncludeLabel, type StudentLibraryPackage } from "@/lib/packages";
import { getStudentSession } from "@/lib/student-auth";

function includeHref(include: { type: string; id: number | null; label: string }) {
  if (!include.id) return null;

  if (include.type === "course") {
    return "/student/courses";
  }

  if (include.type === "mock_category" || include.type === "mock_test") {
    return "/student/mock-tests";
  }

  return null;
}

export function PurchasedPlansList({ compact = false }: { compact?: boolean }) {
  const [plans, setPlans] = useState<StudentLibraryPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStudentSession();
    if (!session?.email) {
      setLoading(false);
      return;
    }

    fetchStudentLibrary(session.email)
      .then((library) => setPlans(library?.packages || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm font-semibold text-[#667085]">Loading subscription plans...</p>;
  }

  if (!plans.length) {
    if (compact) return null;

    return (
      <div className="rounded-[20px] border border-dashed border-[#dfe5ef] bg-[#f8fafc] p-8 text-center">
        <p className="text-sm font-bold text-[#667085]">No active subscription plans.</p>
        <Link href="/packages" className="mt-4 inline-flex h-10 items-center rounded-2xl bg-[#172a69] px-5 text-sm font-extrabold text-white">
          Browse Plans
        </Link>
      </div>
    );
  }

  const visiblePlans = compact ? plans.slice(0, 2) : plans;

  return (
    <div className="grid gap-4">
      {visiblePlans.map((plan) => (
        <article key={plan.id} className="overflow-hidden rounded-[20px] border border-[#dfe5ef] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <div className="border-b border-[#edf1f7] bg-gradient-to-r from-[#172a69] to-[#274dbc] px-5 py-4 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-[#f5c518]" />
                <h3 className="text-[16px] font-extrabold tracking-[-0.02em]">{plan.title}</h3>
              </div>
              <span className="rounded-full bg-white/12 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide">
                {plan.package_type === "combo" ? "Combo Plan" : "Subscription Plan"}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-white/75">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                {plan.expires_at ? `Valid till ${new Date(plan.expires_at).toLocaleDateString()}` : `${plan.validity_months} months access`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                {plan.includes.length} included items
              </span>
            </div>
          </div>

          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7d8799]">Included in your plan</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {plan.includes.map((include, index) => {
                const href = includeHref(include);
                const Icon = include.type === "course" ? BookOpen : WalletCards;

                return (
                  <div key={`${include.type}-${include.id ?? index}`} className="flex items-center justify-between gap-3 rounded-xl border border-[#edf1f7] bg-[#f8fafc] px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <Icon size={15} className="shrink-0 text-[#172a69]" />
                      <span className="truncate text-sm font-semibold text-[#334155]">{packageIncludeLabel(include)}</span>
                    </div>
                    {href ? (
                      <Link href={href} className="shrink-0 text-[11px] font-extrabold text-[#172a69] hover:underline">
                        Open
                      </Link>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
