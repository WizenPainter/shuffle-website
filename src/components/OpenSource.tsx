import { site } from "@/lib/site";
import { GitHubIcon } from "./icons";

const buildSteps = [
  "xcodebuild -downloadComponent MetalToolchain",
  "cargo build --release",
  "./make_app.sh && open ./Shuffle.app",
];

export default function OpenSource() {
  return (
    <section id="open-source" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Open source / pricing */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
              Open source, forever
            </p>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Free core. Pay only if you want more.
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Shuffle is fully open source under the MIT license - the complete
              app is free to use, inspect, and build yourself. A one-time
              purchase for extra power-user features is planned, with no
              subscriptions, ever.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">Free</span>
                </div>
                <p className="mt-1 text-sm text-white/50">The full app, today</p>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {[
                    "Dual panes & tabs",
                    "Command palette & filter",
                    "Deep theming",
                    "All source on GitHub",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="text-brand-300">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative rounded-2xl border border-brand-400/30 bg-brand-500/5 p-6">
                <span className="absolute right-4 top-4 rounded-full border border-brand-400/40 bg-brand-500/10 px-2.5 py-0.5 text-xs font-medium text-brand-200">
                  Planned
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">Pro</span>
                </div>
                <p className="mt-1 text-sm text-white/50">
                  One-time purchase · no subscription
                </p>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {[
                    "Everything in Free",
                    "Extra power-user features",
                    "Support development",
                    "Coming soon",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="text-brand-300">✦</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Build from source */}
          <div className="lg:pl-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
              For developers
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Build it from source
            </h3>
            <p className="mt-3 text-white/60">
              Written in Rust with{" "}
              <a
                href="https://www.gpui.rs/"
                target="_blank"
                rel="noreferrer"
                className="text-brand-300 underline-offset-4 hover:underline"
              >
                GPUI
              </a>{" "}
              - the GPU UI framework behind the Zed editor. Clone it, build it,
              ship your own.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-ink-soft">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 font-mono text-xs text-white/40">
                  Terminal
                </span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed">
                <code>
                  <span className="text-white/35"># clone the repo</span>
                  {"\n"}
                  <span className="text-brand-300">git</span>
                  <span className="text-white/80"> clone {site.githubUrl}</span>
                  {"\n\n"}
                  {buildSteps.map((step, i) => (
                    <span key={i}>
                      <span className="text-brand-300">$</span>
                      <span className="text-white/80"> {step}</span>
                      {"\n"}
                    </span>
                  ))}
                </code>
              </pre>
            </div>

            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition-colors hover:border-white/30 hover:bg-white/10"
            >
              <GitHubIcon className="h-5 w-5" />
              github.com/WizenPainter/shuffle
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
