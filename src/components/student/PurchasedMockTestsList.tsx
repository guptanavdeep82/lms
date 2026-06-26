"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, FileText, Loader2, Play, WalletCards } from "lucide-react";
import { fetchStudentPurchases, hasItemAccess, type StudentPurchase } from "@/lib/checkout";
import { mockTestsApiUrl, type MockCategory, type MockTest, type MockTestsResponse } from "@/lib/mock-tests";
import { getStudentSession } from "@/lib/student-auth";

const gradients = [
  "from-[#172a69] via-[#274dbc] to-[#13a38b]",
  "from-[#0f9f78] via-[#23b889] to-[#f5c518]",
  "from-[#0538A1] via-[#0957D3] to-[#e8a800]",
  "from-[#ba7517] via-[#f0a500] to-[#ffcf33]",
];

const testTypeLabels: Record<string, string> = {
  full_length: "Full Length",
  starter: "Starter Mock",
  sectional: "Sectional",
};

type PurchasedMockTest = MockTest & { categoryId: number };

function collectPurchasedTests(categories: MockCategory[], purchases: StudentPurchase[]): PurchasedMockTest[] {
  const tests: PurchasedMockTest[] = [];

  for (const category of categories) {
    for (const test of category.tests) {
      if (hasItemAccess(purchases, "mock_test", test.id, { mockCategoryId: category.id })) {
        tests.push({ ...test, categoryId: category.id });
      }
    }
  }

  return tests;
}

export function PurchasedMockTestsList() {
  const [tests, setTests] = useState<PurchasedMockTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStudentSession();
    if (!session?.email) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(mockTestsApiUrl()).then((response) => response.json() as Promise<MockTestsResponse>),
      fetchStudentPurchases(session.email),
    ])
      .then(([data, purchases]) => {
        setTests(collectPurchasedTests(data.categories ?? [], purchases));
      })
      .finally(() => setLoading(false));
  }, []);

  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, PurchasedMockTest[]>();
    for (const test of tests) {
      const key = test.category || "Other";
      const existing = groups.get(key) ?? [];
      existing.push(test);
      groups.set(key, existing);
    }
    return groups;
  }, [tests]);

  if (loading) {
    return (
      <div className="grid min-h-[30vh] place-items-center">
        <Loader2 className="animate-spin text-[#172a69]" size={28} />
      </div>
    );
  }

  if (!tests.length) {
    return (
      <div className="rounded-[20px] border border-dashed border-[#dfe5ef] bg-[#f8fafc] p-8 text-center">
        <p className="text-sm font-bold text-[#667085]">No purchased mock tests yet.</p>
        <Link href="/mock-tests" className="mt-4 inline-flex h-10 items-center rounded-2xl bg-[#172a69] px-5 text-sm font-extrabold text-white">
          Browse Mock Tests
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Array.from(groupedByCategory.entries()).map(([categoryName, categoryTests]) => (
        <div key={categoryName}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#7d8799]">{categoryName}</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {categoryTests.map((test, index) => (
              <article
                key={test.slug}
                className="overflow-hidden rounded-[20px] border border-[#e5eaf2] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              >
                <div className={`relative h-20 bg-gradient-to-br ${gradients[index % gradients.length]} p-4 text-white`}>
                  <span className="rounded-full bg-white/16 px-2.5 py-1 text-[10px] font-extrabold backdrop-blur">
                    {testTypeLabels[test.test_type] ?? test.test_type}
                  </span>
                  <WalletCards className="absolute bottom-3 right-3 text-white/75" size={30} />
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-extrabold leading-snug tracking-[-0.02em] text-[#111827]">{test.title}</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-[#f7f9fd] p-2.5">
                      <Clock3 size={14} className="text-[#172a69]" />
                      <p className="mt-1.5 text-[11px] font-extrabold text-[#111827]">{test.duration_minutes} min</p>
                    </div>
                    <div className="rounded-xl bg-[#f7f9fd] p-2.5">
                      <FileText size={14} className="text-[#172a69]" />
                      <p className="mt-1.5 text-[11px] font-extrabold text-[#111827]">{test.questions_count} Qs</p>
                    </div>
                    <div className="rounded-xl bg-[#f7f9fd] p-2.5">
                      <CalendarDays size={14} className="text-[#172a69]" />
                      <p className="mt-1.5 text-[11px] font-extrabold text-[#111827]">{test.total_marks} marks</p>
                    </div>
                  </div>
                  {test.questions_count > 0 ? (
                    <Link
                      href={`/student/mock-tests/${test.slug}/instructions`}
                      className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#172a69] text-xs font-extrabold text-white transition hover:bg-[#10215a]"
                    >
                      <Play size={14} /> Start Test
                    </Link>
                  ) : (
                    <p className="mt-4 text-center text-xs font-semibold text-[#7d8799]">Questions coming soon</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
