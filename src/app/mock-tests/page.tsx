"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Loader2, Search } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { mockTestsApiUrl, type MockCategory, type MockTestsResponse } from "@/lib/mock-tests";

export default function MockTestsPage() {
  const [categories, setCategories] = useState<MockCategory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch(mockTestsApiUrl())
      .then((response) => response.json())
      .then((data: MockTestsResponse) => {
        if (mounted) setCategories(data.categories ?? []);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;

    return categories.filter((category) => `${category.name} ${category.description ?? ""}`.toLowerCase().includes(term));
  }, [categories, search]);

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-[#0b0b0f]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <PublicHeader active="mock-tests" />

      <section className="bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f6d3f5]">Online Test Series</p>
            <h1 className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white sm:text-[46px]">Mock Test Series</h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/70">
              Explore exam-wise mock test series designed to help you practice with the latest pattern, improve speed and accuracy, review your performance, and prepare confidently for competitive exams.
            </p>
          </div>
          <label className="flex h-12 w-full items-center gap-2 rounded-full border border-white/15 bg-white px-4 text-black md:max-w-sm">
            <Search size={17} className="text-[#777]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search test series" className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#777]" />
          </label>
        </div>
      </section>

      <section className="border-b border-[#e9e9e9] bg-white px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-[#ececec] bg-[#f8f8f8] shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
          <img src="/banking-mock-test-hero.png" alt="Banking mock test preparation banner" className="h-[220px] w-full object-cover object-center sm:h-[300px] lg:h-[360px]" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid min-h-80 place-items-center">
            <Loader2 className="animate-spin text-black" size={34} />
          </div>
        ) : (
          <div className="grid gap-7">
            <SeriesGroup title="2026 Mock Test Series" categories={filteredCategories} />
            {!filteredCategories.length && (
              <div className="rounded-lg border border-dashed border-[#d5d5d5] bg-white p-10 text-center">
                <p className="text-lg font-extrabold text-black">No test series found</p>
                <p className="mt-2 text-sm font-semibold text-[#667085]">Admin panel mein published mock tests add karne ke baad yahan show honge.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function SeriesGroup({ title, categories }: { title: string; categories: MockCategory[] }) {
  if (!categories.length) return null;

  return (
    <section>
      <h2 className="mb-5 text-[26px] font-extrabold tracking-[-0.03em] text-black">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <SeriesCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}

function SeriesCard({ category }: { category: MockCategory }) {
  const testsCount = category.tests.length;

  return (
    <article className="rounded-lg border border-[#ececec] bg-white p-5 text-center shadow-[0_7px_24px_rgba(0,0,0,0.08)]">
      <div className="mx-auto grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-[#11afe5] text-white">
        {category.image_url ? (
          <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" />
        ) : (
          <FileText size={24} />
        )}
      </div>
      <h3 className="mt-5 min-h-[48px] text-lg font-extrabold leading-6 text-black">{category.name}</h3>
      <p className="mt-4 text-sm font-semibold text-[#6d6f78]">{testsCount} Online Mock Tests</p>
      <Link href={`/mock-tests/${category.slug}`} className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#f6d3f5] text-sm font-extrabold text-[#683b61] transition hover:bg-[#efc0ec]">
        View Mock Tests <ArrowRight size={15} />
      </Link>
    </article>
  );
}
