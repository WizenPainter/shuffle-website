/**
 * A short, self-contained "answer block" rendered near the top of a page.
 *
 * This exists for GEO (generative-engine optimization): AI assistants lift
 * crisp, declarative, self-contained sentences when they cite or summarize a
 * page. A visible TL;DR that directly answers the page's core question makes
 * that extraction easy and accurate. Keep the text factual and standalone -
 * it should make sense quoted with no surrounding context.
 */
export default function AnswerBlock({
  label = "The short answer",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl border-l-2 border-l-brand-400/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
        {label}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-white/80">
        {children}
      </p>
    </div>
  );
}
