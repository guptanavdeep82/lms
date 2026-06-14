import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicPageShell } from "@/components/PublicPageShell";
import { fetchCmsPageBySlug } from "@/lib/cms-pages";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchCmsPageBySlug(slug);
  if (!page) return { title: "Page Not Found" };

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || undefined,
    keywords: page.meta_keywords || undefined,
  };
}

function PageImage({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return <img src={src} alt={alt} className="h-full w-full object-cover" />;
  }

  return <Image src={src} alt={alt} fill className="object-cover" unoptimized />;
}

export default async function CmsPageDetail({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchCmsPageBySlug(slug);
  if (!page) notFound();

  return (
    <PublicPageShell className="min-h-screen bg-[#f8f9fc] text-slate-950">

      <section className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm font-bold text-[#1b2e6b]">← Back to Home</Link>
          <div className="mt-4 inline-flex rounded-full bg-[#fff9e0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b78600]">
            Latest Exam
          </div>
          <h1 className="mt-5 font-rajdhani text-3xl font-bold leading-tight text-[#1b2e6b] sm:text-4xl lg:text-5xl">
            {page.h1_title}
          </h1>
          {page.image_url ? (
            <div className="relative mt-8 h-64 overflow-hidden rounded-2xl border border-slate-200 sm:h-80">
              <PageImage src={page.image_url} alt={page.h1_title} />
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <article className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {page.description ? (
            <div
              className="cms-page-content prose prose-slate max-w-none text-base leading-8 text-slate-700"
              dangerouslySetInnerHTML={{ __html: page.description }}
            />
          ) : (
            <p className="text-sm font-semibold text-slate-500">Content coming soon.</p>
          )}
        </article>
      </section>
    </PublicPageShell>
  );
}
