import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { comparisons } from "@/lib/comparisons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shuffle compared: Finder & Mac file manager alternatives",
  description:
    "How Shuffle - a free, open source, GPU-rendered macOS file manager - compares to Finder, Path Finder, ForkLift, Marta, Commander One, and File Pilot.",
  alternates: { canonical: "/vs" },
  openGraph: {
    title: "Shuffle compared with other macOS file managers",
    description:
      "Honest, side-by-side comparisons of Shuffle vs Finder and the popular paid and free Mac file managers.",
    url: "/vs",
    type: "website",
  },
};

export default function ComparisonsIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${site.url}/vs` },
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
        <section className="relative mx-auto max-w-4xl px-5 pb-20 pt-36">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
            Compare
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Shuffle vs other macOS file managers
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/60">
            Honest, side-by-side comparisons. See how Shuffle - free, open
            source, and GPU-rendered - stacks up against Finder and the popular
            paid and free file managers for the Mac.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {comparisons.map((c) => (
              <Link
                key={c.slug}
                href={`/vs/${c.slug}`}
                className="glass group rounded-2xl p-6 transition-colors hover:border-white/25"
              >
                <h2 className="text-xl font-semibold tracking-tight text-white/90 group-hover:text-white">
                  Shuffle vs {c.competitor}
                </h2>
                <p className="mt-2 text-sm text-white/55">{c.description}</p>
                <span className="mt-4 inline-block text-sm font-medium text-brand-300">
                  Read the comparison →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
