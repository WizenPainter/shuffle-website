import { site, shortcuts } from "@/lib/site";
import { AppleIcon, DownloadIcon, GitHubIcon } from "./icons";

export default function Download() {
  return (
    <section id="download" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="glass relative overflow-hidden rounded-3xl px-6 py-14 sm:px-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-cyan-glow/15 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Get Shuffle
              </h2>
              <p className="mt-4 max-w-md text-lg text-white/60">
                Download the disk image and drag Shuffle into Applications.
                Built for {site.minMacOS} — universal for Apple Silicon and
                Intel.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={site.dmgUrl}
                  download={site.dmgName}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-95"
                >
                  <AppleIcon className="h-5 w-5" />
                  Download .dmg
                  <DownloadIcon className="h-4 w-4 opacity-60 transition-transform group-hover:translate-y-0.5" />
                </a>
                <a
                  href={site.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white/90 transition-colors hover:border-white/30 hover:bg-white/10"
                >
                  <GitHubIcon className="h-5 w-5" />
                  Build from source
                </a>
              </div>

              <p className="mt-4 text-sm text-white/40">
                Free & open source under the MIT license.
              </p>
            </div>

            {/* shortcuts card */}
            <div className="rounded-2xl border border-white/10 bg-ink-soft/60 p-6">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-300">
                Keyboard shortcuts
              </p>
              <dl className="divide-y divide-white/5">
                {shortcuts.map((s) => (
                  <div
                    key={s.keys}
                    className="flex items-center justify-between py-3"
                  >
                    <dt className="text-sm text-white/60">{s.action}</dt>
                    <dd>
                      <kbd className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/80">
                        {s.keys}
                      </kbd>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
