export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description + index-card summary (~150 chars, factual). */
  description: string;
  /** ISO publish date - also used for sitemap lastModified and JSON-LD. */
  date: string;
  readingTime: string;
  tags: string[];
  /** Posts with hands-on client-side demos get a badge on the index. */
  interactive?: boolean;
};

/** Newest first. Each slug must have a matching component in src/content/blog. */
export const posts: BlogPost[] = [
  {
    slug: "best-finder-alternatives-macos",
    title: "The best Finder alternatives for macOS in 2026, compared",
    description:
      "Shuffle, Path Finder, ForkLift, Marta, QSpace, Nimble Commander and Commander One compared on speed, price, dual panes, and power features.",
    date: "2026-07-14",
    readingTime: "11 min read",
    tags: ["Comparisons", "macOS"],
  },
  {
    slug: "why-is-finder-slow",
    title: "Why is Finder so slow? And what you can actually do about it",
    description:
      "The real reasons macOS Finder lags in big folders - .DS_Store, icon previews, cloud stubs, spring-loaded metadata - and every practical fix.",
    date: "2026-07-07",
    readingTime: "9 min read",
    tags: ["macOS", "Performance"],
  },
  {
    slug: "what-makes-a-file-manager-fast",
    title: "What makes a file manager fast?",
    description:
      "Virtualized lists, GPU rendering, async I/O and the 8 ms frame budget - the engineering behind file browsers that stay instant at 100,000 files.",
    date: "2026-06-29",
    readingTime: "10 min read",
    tags: ["Performance", "Engineering"],
    interactive: true,
  },
  {
    slug: "history-of-the-file-manager",
    title: "From DIRMAINT to Finder: a brief history of the file manager",
    description:
      "Six decades of file management - CP/M and DOS commands, Norton Commander, the Mac's spatial Finder, Windows Explorer, and today's GPU renaissance.",
    date: "2026-06-22",
    readingTime: "12 min read",
    tags: ["History"],
    interactive: true,
  },
  {
    slug: "file-manager-archetypes",
    title: "The four archetypes of file managers",
    description:
      "Orthodox dual-pane, navigational browser, spatial desktop, and Miller columns - where each design came from and which one fits how you work.",
    date: "2026-06-15",
    readingTime: "9 min read",
    tags: ["Design", "History"],
    interactive: true,
  },
  {
    slug: "how-the-dos-fat-file-system-worked",
    title: "8.3 filenames and cluster chains: how the DOS FAT file system worked",
    description:
      "A guided tour of FAT12 - boot sector, allocation table, directory entries, and why deleted files were recoverable - with an interactive disk map.",
    date: "2026-06-08",
    readingTime: "11 min read",
    tags: ["History", "File systems"],
    interactive: true,
  },
  {
    slug: "apfs-how-your-macs-file-system-works",
    title: "APFS explained: what your Mac's file system does under the hood",
    description:
      "Copy-on-write, instant clones, snapshots, space sharing and encryption - how Apple File System actually works and why it replaced HFS+.",
    date: "2026-06-01",
    readingTime: "10 min read",
    tags: ["macOS", "File systems"],
  },
  {
    slug: "how-fuzzy-search-works",
    title: "How fuzzy search works: typo-tolerant matching explained",
    description:
      "Subsequence matching, edit distance, and scoring heuristics behind command palettes - with a live demo you can type into.",
    date: "2026-05-25",
    readingTime: "8 min read",
    tags: ["Engineering", "Search"],
    interactive: true,
  },
  {
    slug: "dual-pane-file-managers",
    title: "Dual-pane file managers: why a 1986 layout still wins",
    description:
      "Norton Commander's two-panel design outlived DOS, Windows 95 and the mouse. Why source-and-destination beats single-window browsing for real work.",
    date: "2026-05-18",
    readingTime: "8 min read",
    tags: ["Design", "History"],
  },
  {
    slug: "building-shuffle-rust-gpui",
    title: "Building a GPU-rendered file manager for macOS in Rust with GPUI",
    description:
      "Why we built a Finder alternative in Rust on GPUI - Metal rendering, virtualized lists, fuzzy search, and the lessons from Zed's UI framework.",
    date: "2026-05-11",
    readingTime: "12 min read",
    tags: ["Engineering", "Shuffle"],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
