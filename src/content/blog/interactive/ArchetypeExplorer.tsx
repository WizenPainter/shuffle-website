"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type ArchetypeId = "orthodox" | "navigational" | "spatial" | "columns";

type Archetype = {
  id: ArchetypeId;
  label: string;
  model: string;
  strengths: string;
  weaknesses: string;
  exemplars: string;
};

const ARCHETYPES: Archetype[] = [
  {
    id: "orthodox",
    label: "Orthodox",
    model:
      "Two fixed panes — source and destination — with every operation on a function key.",
    strengths: "Fastest for bulk copy/move work; fully keyboard-driven.",
    weaknesses: "Austere; steep habits to learn; half the screen per listing.",
    exemplars: "Norton Commander, Total Commander, Midnight Commander",
  },
  {
    id: "navigational",
    label: "Navigational",
    model:
      "One window is a browser: a tree or sidebar for places, back/forward history for movement.",
    strengths: "Familiar to everyone; scales to deep hierarchies.",
    weaknesses:
      "One folder visible at a time makes two-location work clumsy.",
    exemplars: "Windows Explorer, modern macOS Finder",
  },
  {
    id: "spatial",
    label: "Spatial",
    model:
      "Every folder is one real window that permanently remembers its position, size, and layout.",
    strengths: "Files feel like physical objects; strong muscle memory.",
    weaknesses: "Deep trees bury the desktop in windows; it does not scale.",
    exemplars: "Classic Mac OS Finder, OS/2 Workplace Shell, early GNOME Nautilus",
  },
  {
    id: "columns",
    label: "Miller columns",
    model:
      "Each level of the hierarchy is a column; selecting an item opens the next column to the right.",
    strengths: "The whole path is visible at once; great for deep dives.",
    weaknesses: "Poor for wide folders and two-location file operations.",
    exemplars: "NeXTSTEP browser, macOS column view, ranger and lf",
  },
];

/** Small building blocks for the schematic mockups. */
function Row({ w }: { w: string }) {
  return <div className={`h-1 rounded-full bg-white/20 ${w}`} />;
}

function PaneRows({ count = 5 }: { count?: number }) {
  const widths = ["w-3/4", "w-1/2", "w-2/3", "w-3/5", "w-1/2", "w-2/3"];
  return (
    <div className="space-y-1.5 p-2">
      {widths.slice(0, count).map((w, i) => (
        <Row key={i} w={w} />
      ))}
    </div>
  );
}

function Frame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-brand-400/30 bg-ink shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

function TitleBar() {
  return (
    <div className="flex items-center gap-1 border-b border-brand-400/20 px-1.5 py-1">
      <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      <div className="ml-1 h-1 w-8 rounded-full bg-white/15" />
    </div>
  );
}

function OrthodoxMockup() {
  return (
    <Frame className="w-full max-w-xs">
      <TitleBar />
      <div className="grid grid-cols-2 divide-x divide-brand-400/20">
        <div className="bg-brand-500/10">
          <PaneRows />
        </div>
        <div>
          <PaneRows />
        </div>
      </div>
      <div className="flex gap-1 border-t border-brand-400/20 p-1.5">
        {["F3", "F4", "F5", "F6", "F7", "F8"].map((f) => (
          <span
            key={f}
            className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.5rem] leading-none text-white/50"
          >
            {f}
          </span>
        ))}
      </div>
    </Frame>
  );
}

function NavigationalMockup() {
  return (
    <Frame className="w-full max-w-xs">
      <TitleBar />
      <div className="flex items-center gap-1.5 border-b border-brand-400/20 px-2 py-1">
        <span className="font-mono text-[0.5625rem] leading-none text-white/50">
          ←
        </span>
        <span className="font-mono text-[0.5625rem] leading-none text-white/30">
          →
        </span>
        <div className="h-2.5 flex-1 rounded-full bg-white/10" />
      </div>
      <div className="grid grid-cols-[1fr_2fr] divide-x divide-brand-400/20">
        <div className="space-y-1.5 p-2">
          <Row w="w-2/3" />
          <div className="pl-2">
            <Row w="w-2/3" />
          </div>
          <div className="pl-2">
            <Row w="w-1/2" />
          </div>
          <div className="pl-4">
            <Row w="w-1/2" />
          </div>
          <Row w="w-3/5" />
        </div>
        <PaneRows count={6} />
      </div>
    </Frame>
  );
}

function SpatialMockup() {
  return (
    <div className="relative h-36 w-full max-w-xs">
      <Frame className="absolute left-0 top-0 w-8/12">
        <TitleBar />
        <PaneRows count={3} />
      </Frame>
      <Frame className="absolute right-0 top-5 w-7/12">
        <TitleBar />
        <PaneRows count={3} />
      </Frame>
      <Frame className="absolute bottom-0 left-6 w-6/12">
        <TitleBar />
        <PaneRows count={2} />
      </Frame>
    </div>
  );
}

function ColumnsMockup() {
  return (
    <Frame className="w-full max-w-xs">
      <TitleBar />
      <div className="grid grid-cols-4 divide-x divide-brand-400/20">
        <PaneRows count={5} />
        <div className="bg-brand-500/10">
          <PaneRows count={4} />
        </div>
        <PaneRows count={3} />
        <div className="flex items-center justify-center p-2">
          <div className="h-10 w-8 rounded-sm border border-white/25 bg-white/5" />
        </div>
      </div>
    </Frame>
  );
}

const MOCKUPS: Record<ArchetypeId, () => ReactNode> = {
  orthodox: OrthodoxMockup,
  navigational: NavigationalMockup,
  spatial: SpatialMockup,
  columns: ColumnsMockup,
};

export default function ArchetypeExplorer() {
  const [selected, setSelected] = useState<ArchetypeId>("orthodox");
  const active = ARCHETYPES.find((a) => a.id === selected)!;
  const Mockup = MOCKUPS[selected];

  return (
    <div className="demo not-prose">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
        Pick an archetype to see its layout
      </p>
      <div
        role="group"
        aria-label="File manager archetype"
        className="flex flex-wrap gap-1 rounded-xl bg-white/[0.04] p-1"
      >
        {ARCHETYPES.map((a) => (
          <button
            key={a.id}
            type="button"
            aria-pressed={selected === a.id}
            onClick={() => setSelected(a.id)}
            className={`flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selected === a.id
                ? "bg-brand-500/25 text-white ring-1 ring-brand-400/40"
                : "text-white/55 hover:bg-white/[0.06] hover:text-white/80"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex min-h-44 items-center justify-center rounded-xl border border-brand-400/15 bg-white/[0.02] p-4">
        <Mockup />
      </div>

      <dl className="mt-4 space-y-2 text-[0.8125rem] leading-6">
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium text-white/40">Model</dt>
          <dd className="text-white/75">{active.model}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium text-white/40">Strengths</dt>
          <dd className="text-white/75">{active.strengths}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium text-white/40">Weaknesses</dt>
          <dd className="text-white/75">{active.weaknesses}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium text-white/40">Exemplars</dt>
          <dd className="text-white/75">{active.exemplars}</dd>
        </div>
      </dl>
    </div>
  );
}
