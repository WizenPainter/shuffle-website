import { PlayIcon } from "./icons";

type Props = {
  label?: string;
  aspect?: string;
  src?: string;
  poster?: string;
  className?: string;
  chrome?: boolean;
};

/**
 * Renders an app demo clip. When `src` is provided it plays an autoplaying,
 * looping, muted <video>; otherwise it shows a labelled placeholder slot.
 *
 * Our captures already include the app's own window chrome, so `chrome`
 * (the fake macOS traffic-light bar) defaults to off and is only useful for
 * bare screen content.
 */
export default function VideoFrame({
  label = "App demo",
  aspect = "3 / 2",
  src,
  poster,
  className = "",
  chrome = false,
}: Props) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-ink-soft ring-1 ring-white/10 ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {chrome && (
        <div className="absolute inset-x-0 top-0 z-20 flex h-9 items-center gap-2 border-b border-white/5 bg-white/[0.03] px-3.5 backdrop-blur">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate text-xs text-white/40">
            Shuffle - {label}
          </span>
        </div>
      )}

      {src ? (
        <video
          className={`h-full w-full object-cover ${chrome ? "pt-9" : ""}`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={`Shuffle - ${label}`}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${
            chrome ? "pt-9" : ""
          }`}
        >
          {/* animated ambient wash echoing the logo */}
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16),transparent_60%)] blur-2xl" />
          </div>
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-110">
            <PlayIcon className="ml-0.5 h-5 w-5 text-white/80" />
          </div>
          <div className="relative z-10 text-center">
            <p className="text-sm font-medium text-white/80">{label}</p>
            <p className="text-xs text-white/40">Video coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}
