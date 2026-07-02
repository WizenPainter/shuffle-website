import VideoFrame from "./VideoFrame";
import { clips as media } from "@/lib/site";

const clips = [
  {
    label: "Split canvas",
    title: "Drag to split",
    body: "Send a tab to the edge and the window splits into two independent panes — each with its own tabs, history, and filter.",
    media: media.split,
  },
  {
    label: "Command palette",
    title: "Find anything in milliseconds",
    body: "⌘P fuzzy-searches your home directory with typo tolerance, live path browsing, and quick commands.",
    media: media.search,
  },
  {
    label: "Live theming",
    title: "Make it yours",
    body: "Switch between dozens of presets or tune individual colors — every change applies live, instantly.",
    media: media.customization,
  },
];

export default function Showcase() {
  return (
    <section id="showcase" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_50%_50%,rgba(37,99,235,0.1),transparent_70%)]" />
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
            See it move
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Buttery, native, GPU-rendered
          </h2>
          <p className="mt-4 text-balance text-lg text-white/55">
            Real captures, no mockups. A folder with 100,000 items scrolls as
            smoothly as one with 10.
          </p>
        </div>

        <div className="mt-16 space-y-20">
          {clips.map((c, i) => (
            <div
              key={c.label}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <VideoFrame
                  label={c.label}
                  aspect="16 / 10"
                  src={c.media.src}
                  poster={c.media.poster}
                />
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <p className="font-mono text-sm text-brand-300">
                  0{i + 1} — {c.label}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {c.title}
                </h3>
                <p className="mt-3 max-w-md text-white/55">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
