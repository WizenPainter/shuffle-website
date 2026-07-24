export const site = {
  name: "Shuffle",
  tagline: "A modern file explorer for macOS, built for speed.",
  // Canonical production URL - used for metadata, sitemap, robots, JSON-LD and
  // llms.txt. Uses www because Vercel serves the site there (the bare domain
  // 308-redirects to www, and link-preview crawlers like WhatsApp's won't
  // follow image redirects). If the primary domain in Vercel ever flips to
  // the bare domain, change this ONE value to match.
  url: "https://www.shuffleapp.co",
  // One-sentence factual summary, reused across metadata and structured data
  // so search engines and AI assistants get a single consistent description.
  description:
    "Shuffle is a free, open source, GPU-rendered file manager for macOS - a fast, native Finder alternative with dual panes, tabs, a millisecond command palette, terminal mode, live previews, and deep theming. Built in Rust for Apple Silicon.",
  // GitHub repo, in "owner/name" form - the single source for every GitHub URL.
  githubRepo: "WizenPainter/shuffle",
  githubUrl: "https://github.com/WizenPainter/shuffle",
  // The DMG asset filename attached to each GitHub Release. It MUST be named
  // this exactly on every release, so the stable "latest" link below always
  // resolves. (Your build script produces Shuffle-<version>.dmg - upload a copy
  // named Shuffle.dmg too, or rename the asset. See README.)
  dmgName: "Shuffle.dmg",
  // Always points at the newest published release's Shuffle.dmg - GitHub
  // redirects /releases/latest/download/<name> to the current release's asset,
  // so the site never bundles or pins a version.
  dmgUrl: "https://github.com/WizenPainter/shuffle/releases/latest/download/Shuffle.dmg",
  // Human-facing "latest release" page and the API used to read the version.
  latestReleaseUrl: "https://github.com/WizenPainter/shuffle/releases/latest",
  releasesApiUrl:
    "https://api.github.com/repos/WizenPainter/shuffle/releases/latest",
  minMacOS: "macOS 12+",
  price: 0,
  license: "MIT",
  language: "Rust",
  framework: "GPUI",
  author: "Jaime Guzman",
};

export type Faq = { q: string; a: string };

/** Q&A used both for the on-page FAQ and FAQPage JSON-LD (SEO + AI answers). */
export const faqs: Faq[] = [
  {
    q: "What is Shuffle?",
    a: "Shuffle is a free and open source file manager for macOS - a fast, native alternative to Finder. It is GPU-rendered with Metal and built in Rust, so it stays instant even in folders with 100,000+ items, and adds power-user tools like dual panes, tabs, a command palette, and deep theming.",
  },
  {
    q: "Is Shuffle free?",
    a: "Yes. The full Shuffle app is completely free and open source under the MIT license. A one-time purchase for extra power-user features is planned for the future, but there are no subscriptions - ever.",
  },
  {
    q: "Is Shuffle a good Finder alternative?",
    a: "Shuffle is designed as a Finder alternative for power users who find macOS file managers either too limited or too slow. It offers dual-pane split views, tabs, a millisecond fuzzy command palette, an optional terminal mode, QuickLook previews, an in-place filter, automatic cloud drive integration, and dozens of themes - all with native, GPU-rendered speed.",
  },
  {
    q: "What are the system requirements?",
    a: "Shuffle runs on macOS 12 or later. It is tuned for Apple Silicon (M-series) Macs and is a standard Metal app, so it also runs on modern Intel Macs (Intel builds from source).",
  },
  {
    q: "How do I install Shuffle?",
    a: "Download the Shuffle.dmg from the website, open it, and drag Shuffle into your Applications folder. Developers can also clone the GitHub repository and build it from source with Rust and Cargo.",
  },
  {
    q: "Is Shuffle open source?",
    a: "Yes. Shuffle is fully open source under the MIT license, written in Rust with the GPUI framework (the GPU UI toolkit behind the Zed editor). The complete source code is available on GitHub at github.com/WizenPainter/shuffle.",
  },
];

export type Clip = {
  src: string;
  poster: string;
};

/** Web-optimized demo clips (see public/videos). */
export const clips: Record<string, Clip> = {
  hero: { src: "/videos/hero.mp4", poster: "/videos/hero-poster.jpg" },
  split: { src: "/videos/split.mp4", poster: "/videos/split-poster.jpg" },
  search: { src: "/videos/search.mp4", poster: "/videos/search-poster.jpg" },
  customization: {
    src: "/videos/customization.mp4",
    poster: "/videos/customization-poster.jpg",
  },
};

export type Feature = {
  key: string;
  emoji: string;
  title: string;
  description: string;
  shortcut?: string;
};

export const features: Feature[] = [
  {
    key: "split",
    emoji: "🪟",
    title: "Dual panes / split canvas",
    description:
      "Drag a tab to the edge to split the window into two side-by-side panes - each with its own tabs, history, and filter - and a draggable divider resizes them.",
  },
  {
    key: "tabs",
    emoji: "🗂️",
    title: "Tabs that flow",
    description:
      "Open as many as you need, smoothly drag to reorder, and drag tabs between panes.",
    shortcut: "⌘T",
  },
  {
    key: "palette",
    emoji: "⚡",
    title: "Command palette",
    description:
      "Millisecond fuzzy search over your home directory with typo tolerance, live path browsing, and quick commands.",
    shortcut: "⌘P",
  },
  {
    key: "terminal",
    emoji: "⌨️",
    title: "Terminal mode",
    description:
      "An optional command bar to move through the explorer like a shell - cd navigates, Tab autocompletes paths and commands.",
  },
  {
    key: "preview",
    emoji: "👁️",
    title: "Preview & Information",
    description:
      "Single-click a file to QuickLook it - images, PDFs, docs - and inspect its details in a side inspector.",
  },
  {
    key: "filter",
    emoji: "🔎",
    title: "In-place filter",
    description:
      "Instantly narrow the current folder as you type, with the same typo tolerance as search.",
    shortcut: "/",
  },
  {
    key: "cloud",
    emoji: "☁️",
    title: "Cloud & servers",
    description:
      "Dropbox, Google Drive, OneDrive, and iCloud show up automatically, alongside mounted volumes and a Connect to Server dialog.",
  },
  {
    key: "theme",
    emoji: "🎨",
    title: "Deep theming",
    description:
      "Dozens of presets - Catppuccin, Dracula, Nord, Gruvbox, Solarized, Tokyo Night - plus per-color customization applied live.",
  },
];

export const shortcuts: { keys: string; action: string }[] = [
  { keys: "⌘P", action: "Command palette / fuzzy find" },
  { keys: "/", action: "Filter the current directory" },
  { keys: "⌘T", action: "New tab" },
  { keys: "⌘W", action: "Close tab" },
  { keys: "⌘,", action: "Settings" },
];
