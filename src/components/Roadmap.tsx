"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type RoadmapItem = { title: string; note?: string; done: boolean };
type RoadmapSection = { heading: string; items: RoadmapItem[] };

const ROADMAP_RAW_URL = `https://raw.githubusercontent.com/${site.githubRepo}/master/ROADMAP.md`;
const ROADMAP_FILE_URL = `${site.githubUrl}/blob/master/ROADMAP.md`;

/**
 * Shown until ROADMAP.md exists in the GitHub repo (and whenever the fetch
 * fails). Keep it a rough mirror of the real file.
 */
const FALLBACK: RoadmapSection[] = [
  {
    heading: "Now",
    items: [
      { title: "Signed and notarized releases", done: true },
      { title: "Toolbar search and always-visible filter", done: true },
      { title: "Word-wise text selection in palette and path bar", done: true },
      { title: "Performance polish for very large directories", done: false },
    ],
  },
  {
    heading: "Next",
    items: [
      { title: "Batch rename", done: false },
      { title: "Archive browsing", note: "peek into zips without extracting", done: false },
      { title: "Customizable keyboard shortcuts", done: false },
      { title: "Finder tags support", done: false },
    ],
  },
  {
    heading: "Later",
    items: [
      { title: "Plugin / scripting API", done: false },
      { title: "Prebuilt Intel binaries", done: false },
      { title: "Localization", done: false },
      { title: "Maybe: a one-time Pro purchase", note: "never a subscription", done: false },
    ],
  },
];

/**
 * Parses the constrained ROADMAP.md format:
 *   ## Section
 *   - [ ] Item title - optional note
 *   - [x] Done item
 * Unchecked/plain "- item" lines count as not done.
 */
function parseRoadmap(md: string): RoadmapSection[] {
  const sections: RoadmapSection[] = [];
  let current: RoadmapSection | null = null;

  for (const raw of md.split("\n")) {
    const line = raw.trim();
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      current = { heading: heading[1].trim(), items: [] };
      sections.push(current);
      continue;
    }
    const item = line.match(/^-\s*(?:\[( |x|X)\]\s*)?(.+)$/);
    if (item && current && item[2]) {
      const done = (item[1] || "").toLowerCase() === "x";
      const [title, ...noteParts] = item[2].split(" - ");
      current.items.push({
        title: title.trim(),
        note: noteParts.length ? noteParts.join(" - ").trim() : undefined,
        done,
      });
    }
  }
  return sections.filter((s) => s.items.length > 0).slice(0, 4);
}

const BADGE_STYLES: Record<string, string> = {
  now: "border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow",
  next: "border-brand-400/40 bg-brand-500/10 text-brand-200",
  later: "border-white/20 bg-white/5 text-white/60",
};

export default function Roadmap() {
  const [sections, setSections] = useState<RoadmapSection[]>(FALLBACK);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(ROADMAP_RAW_URL)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`${r.status}`))))
      .then((md) => {
        const parsed = parseRoadmap(md);
        if (!cancelled && parsed.length > 0) {
          setSections(parsed);
          setLive(true);
        }
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="roadmap" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
            Roadmap
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            What&apos;s next for Shuffle
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Built in the open. This board reads straight from{" "}
            <a
              href={ROADMAP_FILE_URL}
              target="_blank"
              rel="noreferrer"
              className="text-brand-300 underline-offset-4 hover:underline"
            >
              ROADMAP.md
            </a>{" "}
            in the GitHub repo{live ? "" : " (snapshot shown)"} - plans can and
            do change based on feedback.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {sections.map((section) => {
            const badge =
              BADGE_STYLES[section.heading.toLowerCase()] ?? BADGE_STYLES.later;
            return (
              <div key={section.heading} className="glass rounded-2xl p-6">
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${badge}`}
                >
                  {section.heading}
                </span>
                <ul className="mt-5 space-y-3.5">
                  {section.items.map((item) => (
                    <li key={item.title} className="flex items-start gap-2.5">
                      <span
                        aria-hidden
                        className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border text-[10px] ${
                          item.done
                            ? "border-brand-400/40 bg-brand-500/20 text-brand-200"
                            : "border-white/15 bg-white/[0.03] text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <span
                        className={`text-sm leading-snug ${
                          item.done ? "text-white/45 line-through" : "text-white/80"
                        }`}
                      >
                        {item.title}
                        {item.note && (
                          <span className="block text-xs text-white/40">
                            {item.note}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-white/45">
          Want something on this list?{" "}
          <a
            href={`${site.githubUrl}/issues`}
            target="_blank"
            rel="noreferrer"
            className="text-brand-300 underline-offset-4 hover:underline"
          >
            Open an issue on GitHub
          </a>{" "}
          - feature requests genuinely steer priorities.
        </p>
      </div>
    </section>
  );
}
