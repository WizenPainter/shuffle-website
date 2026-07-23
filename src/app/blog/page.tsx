import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides, comparisons, and deep dives on file managers - Finder alternatives, file-system history, and the engineering behind fast file browsing.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Shuffle blog",
    description:
      "Guides, comparisons, and deep dives on file managers - Finder alternatives, file-system history, and the engineering behind fast file browsing.",
    url: "/blog",
    type: "website",
  },
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndex() {
  const [latest, ...rest] = posts;

  return (
    <>
      <Nav />
      <main className="flex-1">
        <div className="aurora absolute inset-x-0 top-0 h-[420px]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-36">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">
            Blog
          </p>
          <h1 className="mt-3 max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Field notes on <span className="brand-gradient">file management</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/60">
            Comparisons, history, file-system internals, and the engineering
            behind fast file browsing - from the team building Shuffle.
          </p>

          {/* Featured latest post */}
          <Link
            href={`/blog/${latest.slug}`}
            className="glass group mt-12 block rounded-2xl p-8 transition-colors"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
              {latest.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-brand-400/20 bg-brand-500/10 px-2.5 py-0.5 text-brand-200"
                >
                  {t}
                </span>
              ))}
              <span>
                {formatDate(latest.date)} · {latest.readingTime}
              </span>
            </div>
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-white group-hover:text-brand-200 sm:text-3xl">
              {latest.title}
            </h2>
            <p className="mt-3 max-w-3xl text-white/60">{latest.description}</p>
            <span className="mt-5 inline-block text-sm font-medium text-brand-300">
              Read the article →
            </span>
          </Link>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="glass group flex flex-col rounded-2xl p-6 transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-brand-400/20 bg-brand-500/10 px-2.5 py-0.5 text-brand-200"
                    >
                      {t}
                    </span>
                  ))}
                  {post.interactive && (
                    <span className="rounded-full border border-cyan-glow/30 bg-cyan-glow/10 px-2.5 py-0.5 text-cyan-glow">
                      Interactive
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-balance text-lg font-semibold tracking-tight text-white group-hover:text-brand-200">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-white/55">
                  {post.description}
                </p>
                <p className="mt-4 text-xs text-white/40">
                  {formatDate(post.date)} · {post.readingTime}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
