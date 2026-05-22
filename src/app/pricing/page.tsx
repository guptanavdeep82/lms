import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PageShell, SectionHeader } from "@/components/site-shell";
import { plans } from "@/lib/data";

export default function PricingPage() {
  return (
    <PageShell>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Dynamic Subscription" title="Choose a learning plan and unlock course access" text="Plans support 1 month, 2 months, 3 months, 6 months, 12 months and custom duration configuration." />
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-md border p-6 ${plan.featured ? "border-[#f7c843] bg-black text-white shadow-2xl" : "border-black/10 bg-white shadow-sm"}`}>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#9c7411]">{plan.name}</p>
              <p className="mt-5 text-4xl font-black">{plan.price}</p>
              <p className={plan.featured ? "text-white/55" : "text-black/55"}>{plan.term}</p>
              <div className="mt-6 grid gap-3 text-sm">
                {plan.items.map((item) => (
                  <span key={item} className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#f7c843]" /> {item}</span>
                ))}
              </div>
              <Link href="/login" className={`mt-8 block rounded-md px-4 py-3 text-center text-sm font-black ${plan.featured ? "bg-[#f7c843] text-black" : "bg-black text-white"}`}>Login and Buy</Link>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
