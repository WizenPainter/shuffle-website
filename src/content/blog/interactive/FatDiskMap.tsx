"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * A miniature FAT12 volume: 48 clusters (numbered 2-49, as on a real FAT,
 * where entries 0 and 1 are reserved). All data is hardcoded and
 * deterministic. Click a file to walk its cluster chain; delete/recover
 * to see what the FAT actually does on deletion.
 */

type FatFile = {
  name: string;
  size: string;
  chain: number[]; // cluster numbers, in order; last one holds the EOF marker
  deletable?: boolean;
};

const FILES: FatFile[] = [
  { name: "LETTER.TXT", size: "1,214 B", chain: [3, 4, 5], deletable: true },
  { name: "GAME.EXE", size: "3,470 B", chain: [7, 8, 21, 22, 23, 38, 39] },
  { name: "PHOTO.BMP", size: "4,410 B", chain: [10, 11, 12, 13, 27, 28, 29, 30, 31] },
  { name: "SECRET.TXT", size: "1,190 B", chain: [16, 17, 18], deletable: true },
];

const BAD_CLUSTERS = [35];
const FIRST_CLUSTER = 2;
const CLUSTER_COUNT = 48;
const HOP_MS = 380;

type CellState = "free" | "used" | "eof" | "bad" | "ghost";

const LEGEND: { state: CellState; label: string; swatch: string }[] = [
  { state: "free", label: "free (000)", swatch: "border border-white/10 bg-white/[0.04]" },
  { state: "used", label: "in a chain", swatch: "border border-brand-400/40 bg-brand-500/25" },
  { state: "eof", label: "end of chain (FFF)", swatch: "border border-cyan-glow/60 bg-cyan-glow/25" },
  { state: "bad", label: "bad cluster (FF7)", swatch: "border border-red-400/50 bg-red-500/20" },
  {
    state: "ghost",
    label: "freed by delete, data intact",
    swatch: "border border-dashed border-amber-400/50 bg-amber-400/10",
  },
];

function displayName(file: FatFile, deleted: boolean): string {
  // DOS deletion overwrites the first byte of the name with 0xE5,
  // conventionally shown as "?".
  return deleted ? "?" + file.name.slice(1) : file.name;
}

export default function FatDiskMap() {
  const [selected, setSelected] = useState<string>("GAME.EXE");
  const [deleted, setDeleted] = useState<Set<string>>(
    () => new Set(["SECRET.TXT"]),
  );
  const [step, setStep] = useState(0);

  const selectedFile = FILES.find((f) => f.name === selected) ?? null;
  const selectedDeleted = selectedFile ? deleted.has(selectedFile.name) : false;

  // Restart the walk whenever the selection (or its deleted state) changes - 
  // state adjustment during render, per React docs, instead of in an effect.
  const animKey = `${selected}:${selectedDeleted}`;
  const [prevAnimKey, setPrevAnimKey] = useState(animKey);
  if (prevAnimKey !== animKey) {
    setPrevAnimKey(animKey);
    setStep(0);
  }

  // Advance the chain walk one hop at a time.
  useEffect(() => {
    if (!selectedFile) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s + 1 >= selectedFile.chain.length) {
          clearInterval(id);
          return s;
        }
        return s + 1;
      });
    }, HOP_MS);
    return () => clearInterval(id);
  }, [animKey, selectedFile]);

  const ownerOf = useMemo(() => {
    const map = new Map<number, FatFile>();
    for (const f of FILES) for (const c of f.chain) map.set(c, f);
    return map;
  }, []);

  const visited = selectedFile
    ? new Set(selectedFile.chain.slice(0, step + 1))
    : new Set<number>();
  const current = selectedFile ? selectedFile.chain[step] : -1;

  function cellState(cluster: number): CellState {
    if (BAD_CLUSTERS.includes(cluster)) return "bad";
    const owner = ownerOf.get(cluster);
    if (!owner) return "free";
    if (deleted.has(owner.name)) return "ghost";
    if (cluster === owner.chain[owner.chain.length - 1]) return "eof";
    return "used";
  }

  const cellClass: Record<CellState, string> = {
    free: "border-white/10 bg-white/[0.04] text-white/25",
    used: "border-brand-400/40 bg-brand-500/25 text-brand-100",
    eof: "border-cyan-glow/60 bg-cyan-glow/25 text-cyan-glow",
    bad: "border-red-400/50 bg-red-500/20 text-red-300",
    ghost: "border-dashed border-amber-400/50 bg-amber-400/10 text-amber-200/80",
  };

  // FAT readout, revealed hop by hop.
  const fatReadout = selectedFile
    ? selectedFile.chain
        .slice(0, step + 1)
        .map((c, i) => {
          const last = i === selectedFile.chain.length - 1;
          if (selectedDeleted) return `[${c}]=000`;
          return last ? `[${c}]=FFF` : `[${c}]=${selectedFile.chain[i + 1]}`;
        })
        .join("  ")
    : "";

  return (
    <div className="demo not-prose">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
        A 48-cluster FAT volume - click a file to walk its chain
      </p>

      {/* Directory table */}
      <div className="mb-4 space-y-1">
        {FILES.map((f) => {
          const isDeleted = deleted.has(f.name);
          const isSelected = selected === f.name;
          return (
            <div
              key={f.name}
              className={`flex items-center gap-2 rounded-lg px-2 py-1 ${
                isSelected ? "bg-brand-500/15 ring-1 ring-brand-400/30" : "bg-white/[0.03]"
              }`}
            >
              <button
                type="button"
                onClick={() => setSelected(f.name)}
                aria-pressed={isSelected}
                className="flex min-w-0 flex-1 items-baseline gap-3 rounded px-1 py-0.5 text-left font-mono text-[0.8125rem] outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
              >
                <span
                  className={
                    isDeleted ? "text-amber-300/80 line-through decoration-amber-300/40" : "text-white/85"
                  }
                >
                  {displayName(f, isDeleted)}
                </span>
                <span className="hidden text-xs text-white/35 sm:inline">{f.size}</span>
                <span className="ml-auto shrink-0 text-xs tabular-nums text-white/35">
                  start&nbsp;{f.chain[0]}
                </span>
              </button>
              {f.deletable && (
                <button
                  type="button"
                  onClick={() => {
                    setDeleted((prev) => {
                      const next = new Set(prev);
                      if (next.has(f.name)) next.delete(f.name);
                      else next.add(f.name);
                      return next;
                    });
                    setSelected(f.name);
                  }}
                  className={`shrink-0 rounded-md border px-2 py-0.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60 ${
                    isDeleted
                      ? "border-cyan-glow/40 text-cyan-glow hover:bg-cyan-glow/10"
                      : "border-white/15 text-white/50 hover:border-red-400/40 hover:text-red-300"
                  }`}
                >
                  {isDeleted ? "Recover" : "Delete"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Cluster grid */}
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
        {Array.from({ length: CLUSTER_COUNT }, (_, i) => {
          const cluster = FIRST_CLUSTER + i;
          const state = cellState(cluster);
          const isVisited = visited.has(cluster);
          const isCurrent = cluster === current;
          return (
            <div
              key={cluster}
              className={`flex aspect-square items-center justify-center rounded-md border font-mono text-[0.6875rem] tabular-nums transition-all duration-200 ${
                cellClass[state]
              } ${isVisited ? "ring-2 ring-cyan-glow/70" : ""} ${
                isCurrent ? "scale-110 bg-cyan-glow/30 text-white" : ""
              }`}
            >
              {cluster}
            </div>
          );
        })}
      </div>

      {/* FAT readout */}
      <div className="mt-4 min-h-[3.5rem] rounded-lg border border-brand-400/15 bg-ink px-3 py-2 font-mono text-xs leading-5 text-white/70">
        {selectedFile ? (
          selectedDeleted ? (
            <>
              <span className="text-amber-300/90">
                dir entry: {displayName(selectedFile, true)} · first byte 0xE5 · start cluster{" "}
                {selectedFile.chain[0]} · size {selectedFile.size}
              </span>
              <br />
              <span className="text-white/50">FAT: {fatReadout} - chain zeroed, data untouched.</span>
              <br />
              <span className="text-cyan-glow/80">
                undelete: assume contiguous from {selectedFile.chain[0]}, size implies clusters{" "}
                {selectedFile.chain.join(", ")}
              </span>
            </>
          ) : (
            <>
              <span className="text-white/50">
                dir entry: {selectedFile.name} · start cluster {selectedFile.chain[0]} · size{" "}
                {selectedFile.size}
              </span>
              <br />
              <span className="text-brand-200">FAT walk: {fatReadout}</span>
              <br />
              <span className="text-white/50">
                chain: {selectedFile.chain.slice(0, step + 1).join(" -> ")}
                {step === selectedFile.chain.length - 1 ? " -> EOF" : " ..."}
              </span>
            </>
          )
        ) : (
          <span className="text-white/35">Select a file to read its chain.</span>
        )}
      </div>

      {/* Legend */}
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/45">
        {LEGEND.map((l) => (
          <li key={l.state} className="flex items-center gap-1.5">
            <span className={`inline-block h-3 w-3 rounded-sm ${l.swatch}`} aria-hidden="true" />
            {l.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
