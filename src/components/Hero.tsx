import Image from "next/image";
import { site, clips } from "@/lib/site";
import VideoFrame from "./VideoFrame";
import { AppleIcon, DownloadIcon, GitHubIcon, SparkIcon } from "./icons";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20 sm:pt-44">
      <div className="aurora pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-texture pointer-events-none absolute inset-0 -z-10 h-[70vh]" />

      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-rise mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-white/70">
            <SparkIcon className="h-3.5 w-3.5 text-brand-300" />
            Open source · GPU-rendered · Apple Silicon native
          </div>

          <h1
            className="animate-rise text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="text-gradient">The Finder alternative</span>
            <br />
            <span className="brand-gradient">built for speed.</span>
          </h1>

          <p
            className="animate-rise mx-auto mt-6 max-w-xl text-balance text-lg text-white/60"
            style={{ animationDelay: "0.12s" }}
          >
            Shuffle is a small, native macOS file manager that stays instant no
            matter how big the directory — dual panes, tabs, a millisecond
            command palette, and deep theming. No Electron, no jank.
          </p>

          <div
            className="animate-rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.2s" }}
          >
            <a
              href={site.dmgUrl}
              download={site.dmgName}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
            >
              <AppleIcon className="h-5 w-5" />
              Download for macOS
              <DownloadIcon className="h-4 w-4 opacity-60 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white/90 backdrop-blur transition-colors hover:border-white/30 hover:bg-white/10 sm:w-auto"
            >
              <GitHubIcon className="h-5 w-5" />
              View on GitHub
            </a>
          </div>

          <p
            className="animate-rise mt-4 text-sm text-white/40"
            style={{ animationDelay: "0.26s" }}
          >
            Free & open source · {site.minMacOS} · Universal (Apple Silicon &
            Intel)
          </p>
        </div>

        {/* Showcase: primary demo window with floating logo + side clips */}
        <div
          className="animate-rise relative mx-auto mt-16 max-w-5xl"
          style={{ animationDelay: "0.34s" }}
        >
          <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(37,99,235,0.25),transparent_70%)] blur-2xl" />

          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-2 shadow-[0_40px_120px_-40px_rgba(37,99,235,0.6)] backdrop-blur">
            <VideoFrame
              label="Shuffle in action"
              aspect="16 / 10"
              src={clips.hero.src}
              poster={clips.hero.poster}
            />
          </div>

          <Image
            src="/logo.png"
            alt=""
            width={120}
            height={120}
            aria-hidden
            className="animate-float pointer-events-none absolute -left-8 -top-10 hidden h-24 w-24 drop-shadow-[0_10px_40px_rgba(56,189,248,0.6)] sm:block"
          />
        </div>

        {/* trust strip */}
        <div
          className="animate-rise mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
          style={{ animationDelay: "0.42s" }}
        >
          {[
            ["100k+", "items, still smooth"],
            ["Metal", "GPU rendered"],
            ["0ms", "feel command palette"],
            ["Rust", "+ GPUI, no Electron"],
          ].map(([stat, label]) => (
            <div key={label} className="text-center">
              <div className="brand-gradient text-2xl font-bold">{stat}</div>
              <div className="mt-0.5 text-xs text-white/45">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
