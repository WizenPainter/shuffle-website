import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DownloadButton from "@/components/DownloadButton";
import { getPost, posts } from "@/lib/blog";
import { postComponents } from "@/content/blog";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [site.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  const Body = postComponents[slug];
  if (!post || !Body) notFound();

  const index = posts.findIndex((p) => p.slug === slug);
  const newer = index > 0 ? posts[index - 1] : null;
  const older = index < posts.length - 1 ? posts[index + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${site.url}/blog/${post.slug}`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "en",
    keywords: post.tags.join(", "),
    url: `${site.url}/blog/${post.slug}`,
    image: `${site.url}/og.png`,
    author: { "@type": "Person", name: site.author },
    publisher: {
      "@type": "Organization",
      name: "Shuffle",
      url: site.url,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
    },
    isPartOf: { "@type": "Blog", name: "The Shuffle blog", url: `${site.url}/blog` },
    about: {
      "@type": "SoftwareApplication",
      name: "Shuffle",
      operatingSystem: "macOS 12+",
      applicationCategory: "DeveloperApplication",
      url: site.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="flex-1">
        <div className="aurora absolute inset-x-0 top-0 h-[420px]" aria-hidden />
        <article className="relative mx-auto max-w-3xl px-5 pb-20 pt-36">
          <header>
            <nav aria-label="Breadcrumb" className="text-sm text-white/45">
              <Link href="/blog" className="transition-colors hover:text-white">
                ← All articles
              </Link>
            </nav>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-brand-400/20 bg-brand-500/10 px-2.5 py-0.5 text-brand-200"
                >
                  {t}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.15]">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-white/45">
              <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
              {post.readingTime} · by {site.author}
            </p>
          </header>

          <div className="article mt-10">
            <Body />
          </div>

          {/* Post-footer CTA */}
          <aside className="glass mt-14 rounded-2xl p-7 text-center">
            <p className="text-lg font-semibold text-white">
              Try the file manager we write about
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/55">
              Shuffle is a free, open source, GPU-rendered Finder alternative
              for macOS - dual panes, tabs, and a millisecond command palette.
            </p>
            <div className="mt-5 flex justify-center">
              <DownloadButton />
            </div>
          </aside>

          <nav className="mt-10 flex flex-col gap-4 text-sm sm:flex-row sm:justify-between">
            {older ? (
              <Link
                href={`/blog/${older.slug}`}
                className="glass max-w-sm rounded-xl px-5 py-4 transition-colors"
              >
                <span className="text-xs text-white/40">Older</span>
                <span className="mt-1 block font-medium text-white/80">
                  {older.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link
                href={`/blog/${newer.slug}`}
                className="glass max-w-sm rounded-xl px-5 py-4 text-right transition-colors"
              >
                <span className="text-xs text-white/40">Newer</span>
                <span className="mt-1 block font-medium text-white/80">
                  {newer.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
