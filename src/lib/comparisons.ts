/**
 * Data for the /vs/[slug] comparison pages. Each entry targets a high-intent
 * search like "shuffle vs <app>" / "<app> alternative" / "best <app>
 * replacement" and is rendered as an on-page comparison table plus FAQPage and
 * BreadcrumbList structured data (so search engines and AI assistants can cite
 * a clean, factual comparison).
 *
 * Keep the competitor facts honest and current - fair comparisons build trust
 * and age better than marketing spin. `shuffle`/`them` cells are either a short
 * string or a boolean (rendered as a check / dash).
 */

export type CompareCell = string | boolean;

export type CompareRow = {
  feature: string;
  shuffle: CompareCell;
  them: CompareCell;
};

export type Comparison = {
  slug: string;
  /** Full competitor name, e.g. "Path Finder". */
  competitor: string;
  /** Their platform/home link, shown as a courtesy reference. */
  competitorUrl?: string;
  /** Meta title (kept under ~60 chars where possible). */
  title: string;
  /** Meta description / social summary. */
  description: string;
  /** One or two sentences under the H1. */
  intro: string;
  /**
   * A crisp, self-contained TL;DR that directly answers "which should I use?".
   * Written to be quotable by AI assistants with no surrounding context.
   */
  quickAnswer: string;
  /** Short "who it's really for" framing shown near the top. */
  bestFor: { shuffle: string; them: string };
  rows: CompareRow[];
  /** Honest closing take. */
  verdict: string;
  faqs: { q: string; a: string }[];
  /** Sitemap freshness. */
  updated: string;
};

const UPDATED = "2026-08-03";

export const comparisons: Comparison[] = [
  {
    slug: "finder",
    competitor: "Finder",
    title: "Shuffle vs Finder: a faster macOS file manager",
    description:
      "Shuffle vs the built-in macOS Finder - dual panes, tabs, a millisecond command palette, and GPU speed in large folders, versus the default that ships with your Mac.",
    intro:
      "Finder is the file manager built into macOS. Shuffle is a free, open source alternative that keeps Finder's simplicity but adds real power-user tools and stays instant in folders Finder starts to lag in.",
    quickAnswer:
      "Shuffle is a free, open source, GPU-rendered file manager for macOS that serves as a faster, more capable alternative to the built-in Finder. Choose Shuffle over Finder if you work in large folders or want dual panes, tabs, and a command palette; stick with Finder if you only browse small folders and want zero setup. Both are free, and Shuffle can run alongside Finder.",
    bestFor: {
      shuffle:
        "Power users who hit Finder's limits - big directories, dual-pane workflows, keyboard-first navigation.",
      them: "People who want zero setup and only ever browse small folders.",
    },
    rows: [
      { feature: "Price", shuffle: "Free (open source)", them: "Free (built in)" },
      { feature: "Open source", shuffle: true, them: false },
      { feature: "GPU-rendered (Metal)", shuffle: true, them: "Partly" },
      { feature: "Stays smooth at 100k+ items", shuffle: true, them: false },
      { feature: "True dual-pane / split view", shuffle: true, them: false },
      { feature: "Tabs", shuffle: true, them: true },
      { feature: "Fuzzy command palette", shuffle: "⌘P, millisecond", them: false },
      { feature: "In-place typo-tolerant filter", shuffle: true, them: "Basic search" },
      { feature: "Optional terminal / shell mode", shuffle: true, them: false },
      { feature: "Deep theming (color presets)", shuffle: true, them: false },
      { feature: "Cloud drives auto-detected", shuffle: true, them: true },
      { feature: "Apple Silicon native", shuffle: true, them: true },
    ],
    verdict:
      "Finder is fine for light use and needs no install. If you work in large directories, want dual panes and tabs that split, or live on the keyboard, Shuffle does all of that natively and for free - without replacing Finder if you don't want it to.",
    faqs: [
      {
        q: "Can Shuffle replace Finder on macOS?",
        a: "Shuffle runs alongside Finder as a separate app. You can use it for day-to-day file management and still fall back to Finder anytime - macOS keeps Finder as the system file manager, but nothing stops you from making Shuffle your primary one.",
      },
      {
        q: "Is Shuffle faster than Finder?",
        a: "In large directories, yes. Shuffle is GPU-rendered with Metal and built to stay smooth even with 100,000+ items, where Finder can stutter while it loads thumbnails and metadata.",
      },
      {
        q: "Does Shuffle cost anything compared to Finder?",
        a: "Both are free. Finder ships with macOS; Shuffle is free and open source under the MIT license.",
      },
    ],
    updated: UPDATED,
  },
  {
    slug: "path-finder",
    competitor: "Path Finder",
    competitorUrl: "https://www.cocoatech.io",
    title: "Shuffle vs Path Finder: free, fast Finder alternative",
    description:
      "Shuffle vs Cocoatech Path Finder - a free, open source, GPU-rendered file manager versus the long-running paid power-user Finder replacement for macOS.",
    intro:
      "Path Finder is one of the oldest and most feature-packed Finder replacements for the Mac. Shuffle is a newer, free and open source take that focuses on speed and a clean core rather than covering every possible feature.",
    quickAnswer:
      "Shuffle is a free, open source alternative to the paid Path Finder. Choose Shuffle if you want a fast, modern, GPU-rendered file manager with dual panes, tabs, and a command palette at no cost; choose Path Finder if you need its deep, mature toolbox like the drop stack, modules, and built-in terminal and don't mind paying a one-time license.",
    bestFor: {
      shuffle:
        "People who want a fast, modern, free file manager and value speed and keyboard flow over an exhaustive feature list.",
      them: "Users who want a deep, mature toolbox (dual browsers, drop stack, modules) and don't mind paying.",
    },
    rows: [
      { feature: "Price", shuffle: "Free", them: "Paid (one-time license)" },
      { feature: "Open source", shuffle: true, them: false },
      { feature: "GPU-rendered (Metal)", shuffle: true, them: false },
      { feature: "Built with", shuffle: "Rust + GPUI", them: "Objective-C / Cocoa" },
      { feature: "Dual-pane view", shuffle: true, them: true },
      { feature: "Tabs", shuffle: true, them: true },
      { feature: "Fuzzy command palette", shuffle: "⌘P", them: false },
      { feature: "Drop stack / shelf", shuffle: false, them: true },
      { feature: "Deep theming", shuffle: true, them: "Limited" },
      { feature: "Terminal mode", shuffle: true, them: "Built-in terminal" },
      { feature: "Footprint", shuffle: "Small, native", them: "Heavier" },
      { feature: "Apple Silicon native", shuffle: true, them: true },
    ],
    verdict:
      "Path Finder is the more feature-complete tool after decades of development, and its drop stack and modules are genuinely useful. If you don't need all of that and want something free, open source, and noticeably lighter and faster, Shuffle covers the core power-user workflow without a license.",
    faqs: [
      {
        q: "Is Shuffle a free alternative to Path Finder?",
        a: "Yes. Shuffle is free and open source under the MIT license, while Path Finder is a paid app. Shuffle covers the most-used power-user features - dual panes, tabs, fast search, theming - without a purchase.",
      },
      {
        q: "What does Path Finder do that Shuffle doesn't?",
        a: "Path Finder has years of accumulated features like the drop stack, modules, and a built-in terminal panel. Shuffle deliberately keeps a smaller, faster core and adds a command palette and GPU rendering instead.",
      },
    ],
    updated: UPDATED,
  },
  {
    slug: "forklift",
    competitor: "ForkLift",
    competitorUrl: "https://binarynights.com",
    title: "Shuffle vs ForkLift: file manager comparison for Mac",
    description:
      "Shuffle vs ForkLift - a free, open source, GPU-rendered macOS file manager versus the popular paid dual-pane manager known for remote connections and sync.",
    intro:
      "ForkLift is a well-loved paid dual-pane file manager famous for its remote connections (SFTP, S3, WebDAV) and sync. Shuffle is a free, open source alternative focused on local speed and a fast keyboard-driven core.",
    quickAnswer:
      "Shuffle is a free, open source alternative to the paid ForkLift. Choose Shuffle if your work is mostly local and you want the fastest, cleanest GPU-rendered browsing with a command palette at no cost; choose ForkLift if you constantly connect to remote servers (SFTP, S3, WebDAV) and want first-class built-in sync, which are ForkLift's core strengths.",
    bestFor: {
      shuffle:
        "People who mainly manage local files and want maximum speed, a command palette, and no license fee.",
      them: "People who constantly connect to servers and cloud storage and want built-in sync between them.",
    },
    rows: [
      { feature: "Price", shuffle: "Free", them: "Paid (one-time license)" },
      { feature: "Open source", shuffle: true, them: false },
      { feature: "GPU-rendered (Metal)", shuffle: true, them: false },
      { feature: "Dual-pane view", shuffle: true, them: true },
      { feature: "Tabs", shuffle: true, them: true },
      { feature: "Fuzzy command palette", shuffle: "⌘P", them: false },
      { feature: "Remote (SFTP/S3/WebDAV)", shuffle: "Mounted volumes", them: "First-class, built in" },
      { feature: "Folder sync", shuffle: false, them: true },
      { feature: "Deep theming", shuffle: true, them: "Limited" },
      { feature: "Large-directory performance", shuffle: "GPU-smooth", them: "Good" },
      { feature: "Apple Silicon native", shuffle: true, them: true },
    ],
    verdict:
      "If remote connections and sync are central to your day, ForkLift is purpose-built for that and worth its price. If your work is mostly local and you want the fastest, cleanest browsing experience for free, Shuffle is the better fit.",
    faqs: [
      {
        q: "Is Shuffle a free alternative to ForkLift?",
        a: "Yes. Shuffle is free and open source, while ForkLift is a paid app. For local file management Shuffle matches most of the daily workflow; ForkLift still leads on built-in remote servers and sync.",
      },
      {
        q: "Does Shuffle support SFTP and cloud servers like ForkLift?",
        a: "Shuffle shows mounted volumes and cloud drives (Dropbox, Google Drive, OneDrive, iCloud) automatically and has a Connect to Server dialog, but it does not aim to replace ForkLift's deep, first-class remote protocol support and sync engine.",
      },
    ],
    updated: UPDATED,
  },
  {
    slug: "marta",
    competitor: "Marta",
    competitorUrl: "https://marta.sh",
    title: "Shuffle vs Marta: two fast dual-pane Mac file managers",
    description:
      "Shuffle vs Marta - two fast, keyboard-first dual-pane file managers for macOS compared on speed, features, theming, and workflow.",
    intro:
      "Marta is a fast, keyboard-driven dual-pane file manager beloved by terminal users. Shuffle shares that speed-and-keyboard philosophy but adds GPU rendering, a fuzzy command palette, and a more visual, themeable interface.",
    quickAnswer:
      "Shuffle and Marta are both free, fast, keyboard-first dual-pane file managers for macOS. Choose Shuffle if you want GPU rendering, a visual fuzzy command palette, richer built-in theming, and fully open source code; choose Marta if you prefer a minimal, config-file-driven Norton Commander-style workflow. Both are free, so trying each is low-risk.",
    bestFor: {
      shuffle:
        "People who want keyboard speed plus a polished, GPU-rendered, themeable UI and a command palette.",
      them: "Minimalists who love a config-file-driven, Norton Commander-style keyboard workflow.",
    },
    rows: [
      { feature: "Price", shuffle: "Free", them: "Free" },
      { feature: "Open source", shuffle: true, them: "Closed (free)" },
      { feature: "GPU-rendered (Metal)", shuffle: true, them: false },
      { feature: "Built with", shuffle: "Rust + GPUI", them: "Swift" },
      { feature: "Dual-pane view", shuffle: true, them: true },
      { feature: "Tabs", shuffle: true, them: true },
      { feature: "Fuzzy command palette", shuffle: "⌘P", them: "Command-driven" },
      { feature: "Keyboard-first navigation", shuffle: true, them: true },
      { feature: "Theming", shuffle: "Presets + per-color", them: "Config-file themes" },
      { feature: "Large-directory performance", shuffle: "GPU-smooth", them: "Fast" },
      { feature: "Apple Silicon native", shuffle: true, them: true },
    ],
    verdict:
      "Marta and Shuffle are close in spirit - both are fast and keyboard-friendly. Marta leans minimal and config-driven; Shuffle adds GPU rendering, a visual command palette, and richer built-in theming while staying open source. Try both - they're both free.",
    faqs: [
      {
        q: "Is Shuffle like Marta?",
        a: "They share a philosophy: fast, dual-pane, keyboard-first. Shuffle differs by being GPU-rendered, fully open source, and more visually themeable, with a fuzzy command palette (⌘P) as the primary way to move around.",
      },
      {
        q: "Which is faster, Shuffle or Marta?",
        a: "Both are fast and far ahead of Finder. Shuffle renders its whole UI on the GPU with Metal, which keeps scrolling and redraws smooth even in very large directories.",
      },
    ],
    updated: UPDATED,
  },
  {
    slug: "commander-one",
    competitor: "Commander One",
    competitorUrl: "https://mac.eltima.com/file-manager.html",
    title: "Shuffle vs Commander One: dual-pane Mac file manager",
    description:
      "Shuffle vs Commander One - a free, open source, GPU-rendered file manager versus the freemium Norton Commander-style dual-pane manager for macOS.",
    intro:
      "Commander One is a freemium, Norton Commander-style dual-pane file manager with FTP and cloud features gated behind a Pro upgrade. Shuffle is fully free and open source, focused on native GPU speed and a clean core.",
    quickAnswer:
      "Shuffle is a completely free, open source alternative to Commander One, whose FTP, cloud mounting, and archive features are reserved for a paid Pro tier. Choose Shuffle if you want a fast, good-looking, GPU-rendered dual-pane manager for local work with nothing gated; choose Commander One Pro if you specifically need its built-in FTP, cloud mounting, and archive tools in one paid app.",
    bestFor: {
      shuffle:
        "People who want a completely free, fast, open source dual-pane manager with a modern UI.",
      them: "People who want FTP/cloud mounting and archive tools bundled in one app and will pay for Pro.",
    },
    rows: [
      { feature: "Price", shuffle: "Free", them: "Freemium (Pro is paid)" },
      { feature: "Open source", shuffle: true, them: false },
      { feature: "GPU-rendered (Metal)", shuffle: true, them: false },
      { feature: "Dual-pane view", shuffle: true, them: true },
      { feature: "Tabs", shuffle: true, them: true },
      { feature: "Fuzzy command palette", shuffle: "⌘P", them: false },
      { feature: "FTP / cloud mounting", shuffle: "Mounted volumes", them: "Pro feature" },
      { feature: "Archive browsing", shuffle: "Planned", them: true },
      { feature: "Deep theming", shuffle: true, them: "Limited" },
      { feature: "Footprint", shuffle: "Small, native", them: "Heavier" },
      { feature: "Apple Silicon native", shuffle: true, them: true },
    ],
    verdict:
      "Commander One packs FTP, cloud mounting, and archive tools into one app, but the useful parts sit behind a paid Pro tier. If you mainly want a fast, free, good-looking dual-pane manager for local work, Shuffle gives you that with nothing gated.",
    faqs: [
      {
        q: "Is Shuffle a free alternative to Commander One?",
        a: "Yes. Shuffle is entirely free and open source, whereas Commander One reserves features like FTP and cloud mounting for its paid Pro tier.",
      },
      {
        q: "Does Shuffle have a two-pane view like Commander One?",
        a: "Yes. Drag a tab to the edge of the window and Shuffle splits into two independent panes, each with its own tabs, history, and filter.",
      },
    ],
    updated: UPDATED,
  },
  {
    slug: "file-pilot",
    competitor: "File Pilot",
    competitorUrl: "https://filepilot.tech",
    title: "File Pilot for Mac? Shuffle is the closest thing",
    description:
      "Looking for File Pilot on macOS? File Pilot is Windows-only. Shuffle brings the same GPU-rendered, blazing-fast, power-user file manager idea to the Mac.",
    intro:
      "File Pilot is a famously fast, GPU-rendered file manager for Windows - and it's Windows-only. Shuffle is the macOS answer to the same idea: native, GPU-rendered, instant even in huge folders, built for power users.",
    quickAnswer:
      "There is no official File Pilot for Mac - File Pilot is Windows-only. Shuffle is the closest macOS equivalent: a free, open source, GPU-rendered file manager directly inspired by File Pilot's speed and power-user focus, with dual panes, tabs, a command palette, and deep theming. If you want the File Pilot experience on macOS, Shuffle is the app to try.",
    bestFor: {
      shuffle: "Mac users who want the File Pilot experience - raw speed and power-user tools - on macOS.",
      them: "Windows users (File Pilot does not run on macOS).",
    },
    rows: [
      { feature: "Platform", shuffle: "macOS 12+", them: "Windows only" },
      { feature: "Price", shuffle: "Free (open source)", them: "Paid" },
      { feature: "Open source", shuffle: true, them: false },
      { feature: "GPU-rendered", shuffle: "Metal", them: "Direct3D" },
      { feature: "Instant in huge folders", shuffle: true, them: true },
      { feature: "Dual-pane / split view", shuffle: true, them: true },
      { feature: "Tabs", shuffle: true, them: true },
      { feature: "Fuzzy command palette", shuffle: "⌘P", them: true },
      { feature: "Deep theming", shuffle: true, them: true },
      { feature: "Apple Silicon native", shuffle: true, them: "N/A" },
    ],
    verdict:
      "File Pilot is excellent - but it's Windows-only, so there's no version to install on a Mac. Shuffle was directly inspired by it and brings the same GPU-rendered, power-user-first approach to macOS, for free and open source.",
    faqs: [
      {
        q: "Is there a File Pilot for Mac?",
        a: "Not officially - File Pilot is Windows-only. Shuffle is the closest macOS equivalent: a free, open source, GPU-rendered file manager built for the same speed and power-user workflow.",
      },
      {
        q: "Is Shuffle based on File Pilot?",
        a: "Shuffle is inspired by File Pilot's philosophy - native speed, GPU rendering, and real tools for power users - but it is an independent, open source project written in Rust with GPUI for macOS.",
      },
    ],
    updated: UPDATED,
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}
