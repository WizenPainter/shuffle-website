import { site, faqs, features } from "@/lib/site";

/**
 * Structured data (schema.org JSON-LD) for search engines and AI assistants.
 * Uses an @graph so SoftwareApplication, FAQPage, WebSite and Organization all
 * share one script and cross-reference each other by @id.
 */
export default function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${site.url}/#app`,
        name: "Shuffle",
        alternateName: "Shuffle File Manager",
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "File Manager",
        operatingSystem: "macOS 12+",
        description: site.description,
        url: site.url,
        downloadUrl: site.dmgUrl,
        installUrl: site.url,
        softwareVersion: "0.1.0",
        license: "https://opensource.org/licenses/MIT",
        isAccessibleForFree: true,
        image: `${site.url}/logo.png`,
        screenshot: `${site.url}/videos/hero-poster.jpg`,
        programmingLanguage: site.language,
        codeRepository: site.githubUrl,
        featureList: features.map((f) => f.title),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        author: {
          "@type": "Person",
          name: site.author,
        },
        publisher: { "@id": `${site.url}/#org` },
      },
      {
        "@type": "Organization",
        "@id": `${site.url}/#org`,
        name: "Shuffle",
        url: site.url,
        logo: `${site.url}/logo.png`,
        sameAs: [site.githubUrl],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: "Shuffle",
        description: site.description,
        publisher: { "@id": `${site.url}/#org` },
        inLanguage: "en",
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, static, server-rendered content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
