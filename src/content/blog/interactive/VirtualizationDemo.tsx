"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_ROWS = 50_000;
const ROW_HEIGHT = 28;
const VIEWPORT_HEIGHT = 300;
const OVERSCAN = 8;
/** The naive pane only repaints at ~12 fps to simulate a saturated main thread. */
const NAIVE_FRAME_MS = 83;

const STEMS = [
  "invoice",
  "screenshot",
  "report",
  "backup",
  "draft",
  "photo",
  "notes",
  "export",
  "render",
  "dataset",
  "recording",
  "mockup",
];
const EXTS = ["pdf", "png", "txt", "csv", "mov", "zip", "md", "json", "heic", "wav"];

/** Deterministic integer hash - same fake listing on server and client. */
function hash(i: number): number {
  let x = (i + 0x9e3779b9) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
  x = Math.imul(x ^ (x >>> 13), 0x45d9f3b) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
}

function fileName(i: number): string {
  const h = hash(i);
  const stem = STEMS[h % STEMS.length];
  const ext = EXTS[(h >>> 8) % EXTS.length];
  return `${stem}-${String(i + 1).padStart(5, "0")}.${ext}`;
}

function fileSize(i: number): string {
  const h = hash(i * 7 + 3);
  const kb = 4 + (h % 8192);
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

type PaneProps = {
  mode: "naive" | "virtual";
};

function Pane({ mode }: PaneProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const pendingTop = useRef(0);
  const lastPaint = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    if (mode === "virtual") {
      // Real virtualization: recompute the visible slice every frame.
      setScrollTop(top);
      return;
    }
    // Naive simulation: hold repaints to ~12 fps, the way a main thread
    // busy with 50k rows of layout would. Rows visibly lag the scrollbar.
    pendingTop.current = top;
    if (rafId.current !== null) return;
    const tick = (now: number) => {
      if (now - lastPaint.current >= NAIVE_FRAME_MS) {
        lastPaint.current = now;
        rafId.current = null;
        setScrollTop(pendingTop.current);
      } else {
        rafId.current = requestAnimationFrame(tick);
      }
    };
    rafId.current = requestAnimationFrame(tick);
  };

  const first = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const last = Math.min(
    TOTAL_ROWS,
    Math.ceil((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT) + OVERSCAN
  );
  const rows: number[] = [];
  for (let i = first; i < last; i++) rows.push(i);

  const naive = mode === "naive";

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span
          className={`text-xs font-medium uppercase tracking-wider ${
            naive ? "text-white/40" : "text-cyan-glow"
          }`}
        >
          {naive ? "Render everything" : "Virtualized"}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[0.6875rem] tabular-nums ${
            naive
              ? "bg-red-400/10 text-red-300/80"
              : "bg-brand-500/15 text-brand-300"
          }`}
        >
          {naive ? "~12 fps" : "60 fps"}
        </span>
      </div>
      <div
        onScroll={onScroll}
        className="overflow-y-auto rounded-xl border border-brand-400/25 bg-ink"
        style={{ height: VIEWPORT_HEIGHT }}
      >
        <div className="relative" style={{ height: TOTAL_ROWS * ROW_HEIGHT }}>
          {rows.map((i) => (
            <div
              key={i}
              className={`absolute left-0 right-0 flex items-center justify-between gap-3 px-3 font-mono text-xs ${
                i % 2 === 0 ? "bg-white/[0.02]" : ""
              }`}
              style={{ top: i * ROW_HEIGHT, height: ROW_HEIGHT }}
            >
              <span className="truncate text-white/65">{fileName(i)}</span>
              <span className="shrink-0 tabular-nums text-white/30">
                {fileSize(i)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs tabular-nums text-white/40">
        rows in list: 50,000 · rows rendered:{" "}
        <span className={naive ? "text-red-300/90" : "text-cyan-glow"}>
          {naive ? "50,000 (simulated)" : rows.length}
        </span>
      </p>
    </div>
  );
}

export default function VirtualizationDemo() {
  return (
    <div className="demo not-prose">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
        Scroll both lists - same 50,000 files
      </p>
      <div className="flex flex-col gap-5 sm:flex-row">
        <Pane mode="naive" />
        <Pane mode="virtual" />
      </div>
      <p className="mt-4 text-xs leading-5 text-white/40">
        A simulation, honestly labeled: the left pane does not really build
        50,000 DOM nodes (that would jank this whole page) - it renders a
        window but throttles repaints to ~12 fps, the frame rate a main
        thread saturated by that much layout work typically manages. The
        right pane is real windowing: it slices the visible range plus a few
        overscan rows out of the same 50,000-item array on every scroll
        event, so it never touches more than about thirty rows.
      </p>
    </div>
  );
}
