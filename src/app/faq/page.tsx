"use client";

import { useEffect, useState } from "react";
import { ChevronDown, HelpCircle, Loader2 } from "lucide-react";
import { PublicPageShell } from "@/components/PublicPageShell";
import { fetchHomePageData, type HomePageFaq } from "@/lib/home-page";

export default function FaqPage() {
  const [faqs, setFaqs] = useState<HomePageFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchHomePageData()
      .then((data) => {
        if (!mounted) return;
        const items = data?.faqs ?? [];
        setFaqs(items);
        setOpenId(items[0]?.id ?? null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PublicPageShell active="faq">
      <section className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#eef3fb] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0957D3]">
            <HelpCircle size={14} /> Common Questions
          </div>
          <h1 className="font-rajdhani text-3xl font-bold leading-tight text-[#0E318D] sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Everything you need to know about KR Logics courses, mock tests, and student support.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {loading ? (
            <div className="flex min-h-[30vh] items-center justify-center gap-2 text-sm font-semibold text-slate-600">
              <Loader2 className="size-5 animate-spin" /> Loading FAQs...
            </div>
          ) : null}

          {!loading && !faqs.length ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-600">
              FAQs will appear here soon. Please check back later or contact our counselling team.
            </div>
          ) : null}

          <div className="grid gap-3">
            {faqs.map((faq) => {
              const open = openId === faq.id;

              return (
                <article
                  key={faq.id}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                    open ? "border-[#0957D3] shadow-[#0957D3]/10" : "border-slate-200"
                  }`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenId(open ? null : faq.id)}
                    aria-expanded={open}
                  >
                    <span className="text-sm font-bold text-[#0E318D] sm:text-base">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#0957D3] transition ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open ? (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-7 text-slate-600">
                      {faq.answer}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
