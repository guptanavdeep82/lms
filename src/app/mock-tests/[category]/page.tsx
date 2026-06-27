"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BarChart3, Check, ChevronRight, Clock3, FileText, Languages, Loader2, LockKeyhole, PlayCircle, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { PublicPageShell } from "@/components/PublicPageShell";
import { RazorpayCheckoutButton } from "@/components/payments/RazorpayCheckoutButton";
import { fetchStudentPurchases, hasItemAccess, hasPurchase } from "@/lib/checkout";
import { hasCompletedMock } from "@/lib/mock-results";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";
import { mockTestsApiUrl, type MockCategory, type MockTest, type MockTestsResponse } from "@/lib/mock-tests";

const tabs = [
  { key: "full_length", label: "Full Length Test" },
  { key: "starter", label: "Starter Mock" },
  { key: "sectional", label: "Sectional Test" },
];

export default function MockSeriesDetailPage() {
  const router = useRouter();
  const params = useParams<{ category: string }>();
  const categorySlug = params.category;
  const [category, setCategory] = useState<MockCategory | null>(null);
  const [activeTab, setActiveTab] = useState("full_length");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<Awaited<ReturnType<typeof fetchStudentPurchases>>>([]);

  useEffect(() => {
    let mounted = true;

    fetch(mockTestsApiUrl())
      .then((response) => response.json())
      .then((data: MockTestsResponse) => {
        if (!mounted) return;
        const found = (data.categories ?? []).find((item) => item.slug === categorySlug) ?? null;
        setCategory(found);

        if (found) {
          const firstType = tabs.find((tab) => found.tests.some((test) => test.test_type === tab.key))?.key ?? "full_length";
          setActiveTab(firstType);
          setCompleted(Object.fromEntries(found.tests.map((test) => [test.slug, hasCompletedMock(test.slug)])));
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [categorySlug]);

  useEffect(() => {
    if (!category) return;
    const session = getStudentSession();
    if (!session?.email) return;

    fetchStudentPurchases(session.email).then(setPurchases);
  }, [category]);

  const categoryPurchased = category
    ? hasPurchase(purchases, "mock_category", category.id)
      || category.tests.some((test) => hasItemAccess(purchases, "mock_test", test.id, { mockCategoryId: category.id }))
    : false;

  const isTestLocked = (test: MockTest) => {
    if (!test.is_locked) return false;
    return !hasItemAccess(purchases, "mock_test", test.id, { mockCategoryId: category?.id });
  };

  const visibleTests = useMemo(() => {
    return (category?.tests ?? []).filter((test) => test.test_type === activeTab);
  }, [activeTab, category]);

  const summary = useMemo(() => {
    const tests = category?.tests ?? [];
    return {
      total: tests.length,
      open: tests.filter((test) => !isTestLocked(test) && test.questions_count > 0).length,
      locked: tests.filter((test) => isTestLocked(test)).length,
      questions: tests.reduce((sum, test) => sum + test.questions_count, 0),
    };
  }, [category, categoryPurchased]);

  const startTest = (test: MockTest) => {
    if (isTestLocked(test) || test.questions_count === 0) return;

    const target = `/student/mock-tests/${test.slug}/instructions`;
    if (!isStudentLoggedIn()) {
      router.push(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    router.push(target);
  };

  if (loading) {
    return (
      <PublicPageShell active="mock-tests" className="grid min-h-screen place-items-center bg-white">
        <Loader2 className="animate-spin text-black" size={34} />
      </PublicPageShell>
    );
  }

  if (!category) {
    return (
      <PublicPageShell active="mock-tests" className="grid min-h-screen place-items-center bg-[#f5f8fc] px-4 text-center">
        <div>
          <h1 className="text-xl font-extrabold text-[#0E318D]">Series not found</h1>
          <Link href="/mock-tests" className="mt-4 inline-flex h-11 items-center rounded-full bg-[#0957D3] px-5 text-sm font-extrabold text-white">Back to mock tests</Link>
        </div>
      </PublicPageShell>
    );
  }

  const price = category.tests.find((test) => test.sale_price || test.price);
  const completedCount = category.tests.filter((test) => completed[test.slug]).length;

  return (
    <PublicPageShell active="mock-tests" className="min-h-screen bg-[#f5f8fc] text-[#0E318D]">

      <section className="border-b border-[#e2e4e8] bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 text-[11px] font-semibold text-[#69707d]">
          <Link href="/">Home</Link>
          <ChevronRight size={12} />
          <Link href="/mock-tests">Test Series</Link>
          <ChevronRight size={12} />
          <span>{category.name}</span>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#0E318D] via-[#0957D3] to-[#0538A1] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/15 text-white">
                <FileText size={20} />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/75">Online Mock Test Series</p>
                <h1 className="mt-1 text-[26px] font-extrabold tracking-[-0.04em] sm:text-[35px]">{category.name}</h1>
              </div>
            </div>
            <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-white/72">
              {category.description || `Practice speed, accuracy, and exam patterns with ${category.name} mock tests.`}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <HeroStat icon={FileText} label="Mock Tests" value={String(summary.total)} />
              <HeroStat icon={ShieldCheck} label="Open Tests" value={String(summary.open)} />
              <HeroStat icon={LockKeyhole} label="Locked" value={String(summary.locked)} />
              <HeroStat icon={BarChart3} label="Questions" value={String(summary.questions)} />
            </div>
          </div>

          <aside className="rounded-lg border border-white/18 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/75">Your Progress</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <strong className="text-4xl font-extrabold">{completedCount}</strong>
                <span className="ml-2 text-sm font-bold text-white/70">completed</span>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#0957D3]">{summary.total ? Math.round((completedCount / summary.total) * 100) : 0}%</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white" style={{ width: `${summary.total ? (completedCount / summary.total) * 100 : 0}%` }} />
            </div>
            <p className="mt-4 text-xs font-semibold leading-6 text-white/60">Complete tests to unlock result review and track attempt history.</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <section className="min-w-0">
          <div className="rounded-lg border border-[#e0e3e8] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#0E318D]">Available Mock Tests</h2>
                <p className="mt-1 text-xs font-bold text-[#5a6f9a]">Choose test type and start available mock tests.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eef3fb] px-3 py-1.5 text-xs font-extrabold text-[#0957D3]">
                <Sparkles size={14} /> Latest Pattern
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {tabs.map((tab) => {
                const count = category.tests.filter((test) => test.test_type === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`h-12 rounded-lg border px-4 text-left text-sm font-extrabold transition ${
                      activeTab === tab.key
                        ? "border-[#0957D3] bg-[#0957D3] text-white"
                        : "border-[#d9e3f5] bg-[#f5f8fc] text-[#0E318D] hover:border-[#0957D3]/40"
                    }`}
                  >
                    {tab.label} <span className={activeTab === tab.key ? "text-white/60" : "text-[#767b86]"}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid gap-3">
              {visibleTests.map((test) => (
                <TestRow key={test.id} test={test} locked={isTestLocked(test)} completed={Boolean(completed[test.slug])} onStart={() => startTest(test)} />
              ))}
              {!visibleTests.length && (
                <div className="rounded-lg border border-dashed border-[#d8dbe1] bg-white p-8 text-center text-sm font-bold text-[#6f7580]">
                  No mock tests are available in this tab yet.
                </div>
              )}
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-[#e0e3e8] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:sticky lg:top-5">
            <h2 className="border-b border-[#dce6f7] pb-3 text-sm font-extrabold text-[#0957D3]">Highlight Features</h2>
            <div className="mt-4 space-y-2 text-xs font-bold text-[#3d5280]">
              {["Free + paid full length tests", "Sectional and starter mocks", "Latest exam pattern", "Bilingual Hindi and English", "Instant result after submit"].map((feature) => (
                <div key={feature} className="flex items-center gap-2 rounded-lg bg-[#f5f8fc] px-3 py-2">
                  <Check size={14} className="shrink-0 text-[#0957D3]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-[#eef3fb] p-4 text-center">
              {price?.price ? <span className="mr-2 text-sm font-bold text-[#7a8db0] line-through">₹{price.price}</span> : null}
              <span className="text-2xl font-extrabold text-[#0E318D]">₹{price?.sale_price ?? price?.price ?? 0}</span>
              <p className="mt-1 text-xs font-bold text-[#16a34a]">You save ₹300</p>
            </div>
            <RazorpayCheckoutButton
              itemType="mock_category"
              itemId={category.id}
              itemTitle={`${category.name} Test Series`}
              price={price?.sale_price ?? price?.price ?? 0}
              successRedirect={`/mock-tests/${category.slug}`}
              label="Buy Now"
              purchasedLabel="Series Purchased"
              alreadyPurchased={categoryPurchased}
              onPurchased={() => {
                const session = getStudentSession();
                if (session?.email) {
                  fetchStudentPurchases(session.email).then(setPurchases);
                }
              }}
              className="mt-4 h-11 w-full rounded-lg bg-[#0957D3] text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(9,87,211,0.22)] hover:bg-[#0538A1]"
            />
            <div className="mt-4 grid gap-3 border-t border-[#ececec] pt-4 text-xs font-bold text-[#6a707c]">
              <div className="flex items-center justify-between"><span>Total Tests</span><b className="text-[#0E318D]">{summary.total}</b></div>
              <div className="flex items-center justify-between"><span>Available Now</span><b className="text-[#0E318D]">{summary.open}</b></div>
              <div className="flex items-center justify-between"><span>Locked Tests</span><b className="text-[#0E318D]">{summary.locked}</b></div>
            </div>
          </aside>
      </section>
    </PublicPageShell>
  );
}

function TestRow({ test, locked, completed, onStart }: { test: MockTest; locked: boolean; completed: boolean; onStart: () => void }) {
  return (
    <article className="rounded-lg border border-[#d9dde5] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#eef3fb] text-[#0957D3]">
              <FileText size={17} />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-[#0E318D] sm:text-base">{test.title}</h3>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-[#777d89]">
                <span className="inline-flex items-center gap-1"><Languages size={12} /> Bilingual</span>
                <span className="inline-flex items-center gap-1"><FileText size={12} /> {test.questions_count} Questions</span>
                <span className="inline-flex items-center gap-1"><Clock3 size={12} /> {test.duration_minutes} min</span>
              </div>
            </div>
          </div>
        </div>
        {locked ? (
          <span className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-[#eef3fb] px-4 text-xs font-extrabold text-[#0957D3]">
            <LockKeyhole size={13} /> Locked
          </span>
        ) : test.questions_count === 0 ? (
          <span className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-[#eef3fb] px-4 text-xs font-extrabold text-[#0957D3]">
            <LockKeyhole size={13} /> Questions Pending
          </span>
        ) : completed ? (
          <Link href={`/student/mock-tests/${test.slug}/result`} className="inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-[#0957D3] px-4 text-xs font-extrabold text-white hover:bg-[#0538A1]">
            <Trophy size={13} /> View Results
          </Link>
        ) : (
          <button onClick={onStart} className="inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-[#0957D3] px-4 text-xs font-extrabold text-white hover:bg-[#0538A1]">
            <PlayCircle size={13} /> Start Mock Test
          </button>
        )}
      </div>
      <div className="mt-4 grid gap-2 border-t border-[#edf0f4] pt-3 text-[11px] font-bold text-[#777d89] sm:grid-cols-3">
        <span>Marks: <b className="text-[#20242a]">{test.total_marks}</b></span>
        <span>Status: <b className="text-[#20242a]">{test.status}</b></span>
        <span>Mode: <b className="text-[#20242a]">Online Practice</b></span>
      </div>
    </article>
  );
}

function HeroStat({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/18 bg-white/10 p-3 sm:p-4">
      <Icon size={18} className="text-white" />
      <strong className="mt-2 block text-2xl font-extrabold">{value}</strong>
      <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/50">{label}</span>
    </div>
  );
}
