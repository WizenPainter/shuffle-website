import type { CompareCell, CompareRow } from "@/lib/comparisons";

/**
 * Side-by-side feature table for the /vs pages. Boolean cells render as a
 * check (yes) or dash (no); string cells render their text. Scrolls
 * horizontally on narrow screens rather than breaking the page layout.
 */
function Cell({ value, strong }: { value: CompareCell; strong?: boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1.5 text-brand-200">
        <span
          aria-hidden
          className="flex h-5 w-5 items-center justify-center rounded-md border border-brand-400/40 bg-brand-500/15 text-xs"
        >
          ✓
        </span>
        <span className="sr-only">Yes</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-white/30">
        <span
          aria-hidden
          className="flex h-5 w-5 items-center justify-center rounded-md border border-white/10 text-xs"
        >
          –
        </span>
        <span className="sr-only">No</span>
      </span>
    );
  }
  return (
    <span className={strong ? "text-white/90" : "text-white/70"}>{value}</span>
  );
}

export default function ComparisonTable({
  competitor,
  rows,
}: {
  competitor: string;
  rows: CompareRow[];
}) {
  return (
    <div className="table-scroll -mx-1 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="py-3 pr-4 font-medium text-white/45">Feature</th>
            <th className="py-3 pr-4 font-semibold text-brand-200">Shuffle</th>
            <th className="py-3 font-semibold text-white/80">{competitor}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.feature}
              className="border-b border-white/[0.06] align-top"
            >
              <td className="py-3 pr-4 text-white/60">{row.feature}</td>
              <td className="py-3 pr-4">
                <Cell value={row.shuffle} strong />
              </td>
              <td className="py-3">
                <Cell value={row.them} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
