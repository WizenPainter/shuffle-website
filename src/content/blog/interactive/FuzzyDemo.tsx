"use client";

import { useMemo, useState } from "react";

const CANDIDATES = [
  "Documents/Projects/helix_vault/notes.md",
  "Documents/Projects/website/src/components/Hero.tsx",
  "Downloads/Shuffle.dmg",
  "Pictures/Screenshots/screenshot-2026-07-04.png",
  "Documents/taxes/2025/receipts.pdf",
  "Music/playlists/deep-focus.m3u",
  "Developer/finder2/src/main.rs",
  "Documents/Projects/website/package.json",
  "Library/Application Support/Shuffle/themes/catppuccin.toml",
  "Desktop/meeting-notes-july.txt",
  "Movies/screen-recordings/demo-split-view.mp4",
  "Documents/resume/resume_2026_final_FINAL.docx",
];

type Match = {
  path: string;
  score: number;
  matched: Set<number>;
};

/**
 * Tiny fzf-style subsequence scorer: every query char must appear in order;
 * consecutive matches and word-boundary hits earn bonuses, gaps cost points.
 */
function fuzzyScore(query: string, text: string): Match | null {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const matched = new Set<number>();
  let score = 0;
  let ti = 0;
  let lastMatch = -2;

  for (let qi = 0; qi < q.length; qi++) {
    const idx = t.indexOf(q[qi], ti);
    if (idx === -1) return null;
    matched.add(idx);
    if (idx === lastMatch + 1) score += 8; // consecutive run
    const prev = text[idx - 1];
    if (idx === 0 || prev === "/" || prev === "_" || prev === "-" || prev === ".")
      score += 10; // word boundary
    score -= Math.min(idx - ti, 10); // gap penalty (capped)
    lastMatch = idx;
    ti = idx + 1;
  }
  score -= Math.floor(text.length / 20); // slight bias toward short paths
  return { path: text, score, matched };
}

export default function FuzzyDemo() {
  const [query, setQuery] = useState("hxvault");

  const results = useMemo(() => {
    if (!query.trim()) {
      return CANDIDATES.map((path) => ({
        path,
        score: 0,
        matched: new Set<number>(),
      }));
    }
    return CANDIDATES.map((c) => fuzzyScore(query.trim(), c))
      .filter((m): m is Match => m !== null)
      .sort((a, b) => b.score - a.score);
  }, [query]);

  return (
    <div className="demo not-prose">
      <label
        htmlFor="fuzzy-demo-input"
        className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40"
      >
        Try it — type a few letters, skip some, make a typo
      </label>
      <input
        id="fuzzy-demo-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. hxvault, shdmg, mainrs…"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-xl border border-brand-400/25 bg-ink px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-glow/60"
      />
      <ul className="mt-3 max-h-72 space-y-1 overflow-y-auto font-mono text-[0.8125rem] leading-6">
        {results.length === 0 && (
          <li className="px-3 py-2 text-white/35">
            No match — every query character must appear in order.
          </li>
        )}
        {results.map((r, i) => (
          <li
            key={r.path}
            className={`flex items-baseline justify-between gap-4 rounded-lg px-3 py-1.5 ${
              i === 0 && query.trim()
                ? "bg-brand-500/15 ring-1 ring-brand-400/30"
                : "bg-white/[0.03]"
            }`}
          >
            <span className="truncate text-white/70">
              {r.path.split("").map((ch, idx) => (
                <span
                  key={idx}
                  className={
                    r.matched.has(idx)
                      ? "font-bold text-cyan-glow"
                      : undefined
                  }
                >
                  {ch}
                </span>
              ))}
            </span>
            {query.trim() && (
              <span className="shrink-0 text-xs tabular-nums text-white/35">
                {r.score}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
