"use client";

import { useState } from "react";

type Era = "CLI" | "TUI" | "GUI" | "Search" | "GPU";

type Milestone = {
  year: string;
  name: string;
  oneLiner: string;
  era: Era;
  detail: string;
};

const MILESTONES: Milestone[] = [
  {
    year: "1971",
    name: "Unix ls, cp, mv",
    oneLiner: "File work as small composable commands",
    era: "CLI",
    detail:
      "The First Edition of Unix at Bell Labs shipped file management as a toolkit of tiny programs — ls, cp, mv, rm — glued together by the shell. Fifty-five years later they are still the fallback every power user reaches for.",
  },
  {
    year: "1974",
    name: "CP/M",
    oneLiner: "DIR and PIP on the first mass-market micros",
    era: "CLI",
    detail:
      "Gary Kildall's CP/M gave microcomputers a built-in DIR command and copied files with PIP, a utility inherited from DEC minicomputers — with the destination written before the source. MS-DOS later cloned this world almost verbatim.",
  },
  {
    year: "1981",
    name: "Xerox Star",
    oneLiner: "Files become icons on a desktop",
    era: "GUI",
    detail:
      "The Xerox 8010 Star was the first commercial system to draw files as icons you could drag onto folders and printers. It cost over $16,000 and sold poorly, but every graphical file manager since is its descendant.",
  },
  {
    year: "1984",
    name: "Macintosh Finder",
    oneLiner: "The spatial desktop reaches the mass market",
    era: "GUI",
    detail:
      "Written by Bruce Horn and Steve Capps, the original Finder made every folder a window that remembered its own position, size, and icon layout. That spatial model shaped how a generation thought about their files.",
  },
  {
    year: "1985",
    name: "XTree",
    oneLiner: "A visual directory tree for DOS",
    era: "TUI",
    detail:
      "Released by Executive Systems in April 1985, XTree drew the entire disk as a navigable tree of text and let you tag many files for one batch operation — revolutionary next to typing COPY commands one at a time.",
  },
  {
    year: "1986",
    name: "Norton Commander",
    oneLiner: "Two panes and F-keys define the orthodox manager",
    era: "TUI",
    detail:
      "John Socha's Norton Commander put source and destination side by side and bound every operation to a function key: F5 copy, F6 move, F8 delete. The dual-pane 'orthodox' archetype it created is still actively cloned today.",
  },
  {
    year: "1990",
    name: "Windows File Manager",
    oneLiner: "winfile.exe brings trees and lists to Windows",
    era: "GUI",
    detail:
      "Windows 3.0 replaced the text-based MS-DOS Executive with File Manager: a directory tree beside a file list, drag-and-drop copying, multiple child windows. Microsoft open-sourced it in 2018, and it still runs on Windows 11.",
  },
  {
    year: "1995",
    name: "Windows 95 Explorer",
    oneLiner: "The navigational browser becomes the default",
    era: "GUI",
    detail:
      "Explorer merged desktop, tree, and file list into a single browsing window with back-and-forward history — a model so successful that nearly every mainstream file manager since, including the modern Finder, works the same way.",
  },
  {
    year: "2005",
    name: "Spotlight",
    oneLiner: "Search starts to replace navigation",
    era: "Search",
    detail:
      "Mac OS X 10.4 Tiger indexed every file's name, metadata, and contents for instant system-wide search. Once finding a file no longer required knowing where it lived, careful folder hierarchies started to feel optional.",
  },
  {
    year: "2017",
    name: "iOS Files app",
    oneLiner: "Apple concedes mobile needs a file manager",
    era: "Search",
    detail:
      "The iPhone launched in 2007 with no user-visible file system at all — apps owned their data, and search plus recents replaced folders. A decade later, iOS 11 quietly added the Files app, an admission that hiding files entirely never fully worked.",
  },
  {
    year: "2025",
    name: "File Pilot",
    oneLiner: "Game-engine rendering comes to file management",
    era: "GPU",
    detail:
      "Built by ex-game-developer Vjekoslav Krajačić, File Pilot for Windows renders its entire interface on the GPU from a tiny standalone executable. Its public beta showed a file window could feel as immediate as a game.",
  },
  {
    year: "2026",
    name: "Shuffle",
    oneLiner: "The GPU renaissance reaches the Mac",
    era: "GPU",
    detail:
      "Shuffle is a free, open-source file manager for macOS written in Rust on GPUI, the framework behind the Zed editor. Dual panes, tabs, and a millisecond fuzzy command palette — a deliberate remix of every era before it.",
  },
];

const ERA_CHIP: Record<Era, string> = {
  CLI: "bg-white/10 text-white/70 ring-white/20",
  TUI: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
  GUI: "bg-brand-500/15 text-brand-300 ring-brand-400/40",
  Search: "bg-purple-400/10 text-purple-300 ring-purple-400/30",
  GPU: "bg-cyan-glow/10 text-cyan-glow ring-cyan-glow/40",
};

const ERA_DOT: Record<Era, string> = {
  CLI: "bg-white/50",
  TUI: "bg-amber-300",
  GUI: "bg-brand-400",
  Search: "bg-purple-300",
  GPU: "bg-cyan-glow",
};

export default function FileManagerTimeline() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="demo not-prose">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
        Six decades of file management — tap a milestone for the story
      </p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(Object.keys(ERA_CHIP) as Era[]).map((era) => (
          <span
            key={era}
            className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-medium ring-1 ${ERA_CHIP[era]}`}
          >
            {era}
          </span>
        ))}
      </div>
      <ol className="relative ml-2 border-l border-brand-400/20">
        {MILESTONES.map((m, i) => {
          const expanded = open === i;
          return (
            <li key={m.name} className="relative pb-2 pl-5 last:pb-0">
              <span
                aria-hidden="true"
                className={`absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full ${ERA_DOT[m.era]}`}
              />
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : i)}
                className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                  expanded
                    ? "bg-brand-500/15 ring-1 ring-brand-400/30"
                    : "hover:bg-white/[0.04]"
                }`}
              >
                <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-mono text-xs tabular-nums text-white/40">
                    {m.year}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {m.name}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-px text-[0.625rem] font-medium ring-1 ${ERA_CHIP[m.era]}`}
                  >
                    {m.era}
                  </span>
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-white/55">
                  {m.oneLiner}
                </span>
                {expanded && (
                  <span className="mt-2 block border-t border-brand-400/15 pt-2 text-[0.8125rem] leading-6 text-white/75">
                    {m.detail}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
