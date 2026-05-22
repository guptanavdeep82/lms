import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, PlayCircle, ShieldCheck, ShoppingBag } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { courses } from "@/lib/data";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courses.find((item) => item.slug === slug);
  if (!course) notFound();

  return (
    <PageShell>
      <section className="bg-[#10100d] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f7c843]">{course.category}</p>
            <h1 className="mt-4 text-5xl font-black tracking-tight">{course.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">Recorded video library, notes, mock tests, live sessions and discussion support bundled into one student subscription.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#f7c843] px-6 text-sm font-black text-black">
                <ShoppingBag size={18} /> Login and Buy
              </Link>
              <Link href="/student/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-6 text-sm font-bold">
                <PlayCircle size={18} /> Preview Dashboard
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-white/10 bg-white/10 p-3">
            <div className="relative h-80 rounded-md">
              <Image src={course.image} alt={course.title} fill className="rounded-md object-cover" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.75fr_0.25fr] lg:px-8">
        <div className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black">What students get</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {["Course-wise video library", "Subject categorization", "Continue watching", "Speed and resolution controls", "Mock tests with ranks", "Paid notes access", "Live class notifications", "Forum doubt support"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md bg-[#fbfaf6] p-3">
                <CheckCircle2 className="text-[#9c7411]" size={20} />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <aside className="rounded-md border border-black/10 bg-black p-6 text-white shadow-sm">
          <p className="text-sm text-white/55">Subscription</p>
          <p className="mt-2 text-4xl font-black text-[#f7c843]">{course.price}</p>
          <p className="mt-1 text-white/60">{course.duration} dynamic access</p>
          <div className="mt-6 grid gap-3 text-sm text-white/70">
            <span className="flex gap-2"><ShieldCheck size={17} className="text-[#f7c843]" /> Secure access control</span>
            <span className="flex gap-2"><ShieldCheck size={17} className="text-[#f7c843]" /> Download-protected videos</span>
            <span className="flex gap-2"><ShieldCheck size={17} className="text-[#f7c843]" /> OTP and Google login</span>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
