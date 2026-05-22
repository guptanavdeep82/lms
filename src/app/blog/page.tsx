import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { PageShell, SectionHeader } from "@/components/site-shell";
import { blogs } from "@/lib/data";

export default function BlogPage() {
  return (
    <PageShell>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="SEO Blog" title="Educational content publishing with search and categories" text="Blog module is ready for preparation guides, announcements, exam strategy and shareable learning content." />
        <div className="mx-auto mb-8 flex max-w-3xl items-center gap-3 rounded-md border border-black/10 bg-white px-4 py-3 shadow-sm">
          <Search size={18} className="text-black/45" />
          <span className="text-sm text-black/55">Search preparation, mocks, notes, live class topics...</span>
        </div>
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {blogs.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="rounded-md border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9c7411]">{blog.category}</p>
              <h2 className="mt-4 text-2xl font-black leading-tight">{blog.title}</h2>
              <p className="mt-4 text-sm text-black/55">{blog.date} | {blog.read}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black">Read Article <ArrowRight size={16} /></span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
