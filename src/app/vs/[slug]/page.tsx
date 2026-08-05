import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DownloadButton from "@/components/DownloadButton";
import ComparisonTable from "@/components/ComparisonTable";
import AnswerBlock from "@/components/AnswerBlock";
import { comparisons, getComparison } from "@/lib/comparisons";
import { site } from "@/lib/site";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/vs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/vs/${c.slug}` },
    openGraph: {
      title: c.title,
      description: c.description,
      url: `/vs/${c.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
    },
  };
}

export default async function ComparisonPage({
  params,
}: PageProps<"/vs/[slug]">) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  const others = comparisons.filter((x) => x.slug !== c.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Compare",
            item: `${site.url}/vs`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `Shuffle vs ${c.competitor}`,
            item: `${site.url}/vs/${c.slug}`,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${site.url}/vs/${c.slug}/#article`,
        headline: c.title,
        description: c.description,
        url: `${site.url}/vs/${c.slug}`,
        datePublished: c.updated,
        dateModified: c.updated,
        inLanguage: "en",
        author: { "@type": "Person", name: site.author },
        publisher: {
          "@type": "Organization",
          name: "Shuffle",
          url: site.url,
          logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
        },
        about: {
          "@type": "SoftwareApplication",
          name: "Shuffle",
          operatingSystem: "macOS 12+",
          applicationCategory: "DeveloperApplication",
          url: site.url,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/vs/${c.slug}/#faq`,
        mainEntity: c.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
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
              <Link href="/vs" className="transition-colors hover:text-white">
                ← All comparisons
              </Link>
            </nav>
            <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.15]">
              Shuffle vs {c.competitor}
            </h1>
            <p className="mt-4 text-lg text-white/60">{c.intro}</p>
            <p className="mt-4 text-sm text-white/45">
              Updated <time dateTime={c.updated}>{formatDate(c.updated)}</time> ·
              by {site.author}
            </p>
          </header>

          {/* Quotable TL;DR for search engines and AI assistants */}
          <div className="mt-8">
            <AnswerBlock>{c.quickAnswer}</AnswerBlock>
          </div>

          {/* Best-for framing */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                Choose Shuffle if
              </p>
              <p className="mt-2 text-sm text-white/70">{c.bestFor.shuffle}</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Choose {c.competitor} if
              </p>
              <p className="mt-2 text-sm text-white/70">{c.bestFor.them}</p>
            </div>
          </div>

          {/* Comparison table */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">
              Shuffle vs {c.competitor}, feature by feature
            </h2>
            <div className="mt-5">
              <ComparisonTable competitor={c.competitor} rows={c.rows} />
            </div>
          </section>

          {/* Verdict */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">The verdict</h2>
            <p className="mt-3 text-white/70">{c.verdict}</p>
          </section>

          {/* CTA */}
          <aside className="glass mt-12 rounded-2xl p-7 text-center">
            <p className="text-lg font-semibold text-white">
              Try Shuffle for yourself
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/55">
              Free and open source. {site.minMacOS}. Universal (Apple Silicon &
              Intel).
            </p>
            <div className="mt-5 flex justify-center">
              <DownloadButton />
            </div>
          </aside>

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
            <dl className="mt-5 space-y-5">
              {c.faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-medium text-white/85">{f.q}</dt>
                  <dd className="mt-1.5 text-sm text-white/60">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Other comparisons */}
          <section className="mt-14 border-t border-white/10 pt-8">
            <p className="text-sm font-semibold text-white/70">
              Compare Shuffle with more file managers
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/vs/${o.slug}`}
                  className="rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  vs {o.competitor}
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
