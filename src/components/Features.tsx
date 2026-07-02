import { features } from "@/lib/site";

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
            Power-user tools
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything Finder should have been
          </h2>
          <p className="mt-4 text-balance text-lg text-white/55">
            macOS file managers are either too limited or too slow. Shuffle gives
            you real tools instead of getting in the way.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.key}
              className={`glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 sm:opacity-0" />
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">{f.emoji}</span>
                {f.shortcut && (
                  <kbd className="rounded-md border border-white/15 bg-white/5 px-2 py-1 font-mono text-xs text-white/70">
                    {f.shortcut}
                  </kbd>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
