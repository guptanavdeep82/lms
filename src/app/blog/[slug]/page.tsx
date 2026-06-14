import { notFound } from "next/navigation";
import { PageShell } from "@/components/site-shell";
import { blogs } from "@/lib/data";

export function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find((item) => item.slug === slug);
  if (!blog) notFound();

  return (
    <PageShell>
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9c7411]">{blog.category}</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">{blog.title}</h1>
        <p className="mt-4 text-sm text-black/55">{blog.date} | {blog.read}</p>
        <div className="mt-10 space-y-6 text-lg leading-8 text-black/70">
          <p>This article page is designed as an SEO friendly blog template for the LMS. It can publish exam preparation guides, mock test analysis, course updates and notes announcements.</p>
          <p>Students can discover content publicly, then login to unlock the full LMS experience including courses, PDFs, live sessions, forum discussions and analytics.</p>
          <p>Admin side can later manage title, category, content, sharing metadata and publishing status from the blog management module.</p>
        </div>
      </article>
    </PageShell>
  );
}
