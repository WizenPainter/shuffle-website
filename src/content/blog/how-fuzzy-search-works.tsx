import Link from "next/link";
import FuzzyDemo from "./interactive/FuzzyDemo";

export default function HowFuzzySearchWorks() {
  return (
    <>
      <p>
        Type <code>hxvault</code> into a good command palette and it finds{" "}
        <code>helix_vault</code>. Type <code>mainrs</code> and it finds{" "}
        <code>src/main.rs</code>. No wildcards, no exact spelling, and often a
        typo or two forgiven. This behavior - <strong>fuzzy search</strong> - 
        has become the default way developers and power users navigate
        everything from code editors to file managers. Here is how it actually
        works, with a live demo you can type into.
      </p>

      <h2>Try it first</h2>
      <p>
        This is a real fuzzy matcher running in your browser - a miniature
        version of the algorithm family used by tools like <code>fzf</code>,
        VS&nbsp;Code&apos;s quick-open, and Shuffle&apos;s command palette.
        The highlighted letters show which characters matched; the number is
        the match&apos;s score.
      </p>
      <FuzzyDemo />

      <h2>Step 1: subsequence matching</h2>
      <p>
        The core rule is simpler than most people expect:{" "}
        <strong>
          every character of the query must appear in the candidate, in order
        </strong>{" "}
        - but not necessarily adjacent. <code>hxvault</code> matches{" "}
        <code>helix_vault</code> because you can walk left to right and find{" "}
        <code>h</code>, then <code>x</code>, then <code>v-a-u-l-t</code>. That
        check is a single linear scan per candidate: for each query character,
        find its next occurrence in the text. If any character can&apos;t be
        found, the candidate is out.
      </p>
      <p>
        Subsequence matching alone is binary - match or no match. The magic
        that makes fuzzy search feel smart is what happens next.
      </p>

      <h2>Step 2: scoring - the interesting part</h2>
      <p>
        A query like <code>doc</code> matches hundreds of paths. The ranking
        is what decides whether the one you meant is at the top. Practical
        scorers reward and penalize a handful of things:
      </p>
      <ul>
        <li>
          <strong>Consecutive runs.</strong> Matching{" "}
          <code>d-o-c</code> as an unbroken run in <code>Documents</code> is
          worth much more than three scattered letters. Real typing tends to
          produce prefixes and runs, so runs are strong intent signals.
        </li>
        <li>
          <strong>Word boundaries.</strong> A hit on the first letter after a{" "}
          <code>/</code>, <code>_</code>, <code>-</code>, <code>.</code>, or a
          lowercase-to-uppercase transition (camelCase) scores a bonus. This is
          why <code>ffm</code> finds <code>fast-file-manager</code>: three
          boundary hits beat any buried substring.
        </li>
        <li>
          <strong>Gap penalties.</strong> Every character skipped between
          matches costs a little. Tight matches beat sprawling ones.
        </li>
        <li>
          <strong>Length bias.</strong> All else equal, shorter candidates
          win - matching 5 of 10 characters is more meaningful than 5 of 80.
        </li>
      </ul>
      <p>
        The demo above implements exactly these four rules in about thirty
        lines. Production matchers refine the weights - <code>fzf</code>&apos;s
        v2 algorithm is a variant of{" "}
        <strong>Smith-Waterman alignment</strong>, borrowed from
        bioinformatics, which uses dynamic programming to find the{" "}
        <em>optimal</em> assignment of query characters to positions rather
        than the greedy first-occurrence walk. Greedy is faster; alignment
        ranks better when a character could match in several places.
      </p>

      <h2>Step 3: typo tolerance</h2>
      <p>
        Strict subsequence matching fails the moment you transpose two letters
        - <code>hlexi</code> no longer matches <code>helix</code>. Tools that
        forgive typos bring in a second concept:{" "}
        <strong>edit distance</strong>. The Levenshtein distance between two
        strings is the minimum number of single-character insertions,
        deletions, and substitutions to turn one into the other (the
        Damerau variant adds transpositions, the most common real typo).
        A typo-tolerant matcher accepts candidates within a small distance
        budget - usually 1 for short queries, 2 for longer ones - and applies
        a score penalty per correction, so exact matches still rank first.
      </p>
      <p>
        Computing edit distance for every candidate is more expensive than a
        linear scan, so engines use tricks to avoid doing it often: try the
        cheap subsequence pass first and only fall back to fuzzy-with-typos
        when it yields nothing, or use banded dynamic programming that abandons
        a candidate as soon as its minimum possible distance exceeds the
        budget.
      </p>

      <h2>Making it fast at file-system scale</h2>
      <p>
        A code editor fuzzy-searches a few thousand project files. A file
        manager&apos;s palette searches your <em>home directory</em> - easily
        half a million paths. At that scale the per-candidate cost dominates,
        and three engineering choices matter:
      </p>
      <ol>
        <li>
          <strong>Index up front.</strong> Walk the directory tree once in the
          background and keep the paths in a compact in-memory list, rather
          than hitting the file system per keystroke.
        </li>
        <li>
          <strong>Filter cheaply, score selectively.</strong> The binary
          subsequence test eliminates most candidates in nanoseconds; only
          survivors get the expensive scoring pass.
        </li>
        <li>
          <strong>Search incrementally.</strong> When the query grows from{" "}
          <code>doc</code> to <code>docu</code>, every match of the longer
          query is necessarily a match of the shorter one - so you can search
          within the previous result set instead of the full corpus.
        </li>
      </ol>
      <p>
        Do all three and ranking half a million paths takes single-digit
        milliseconds - which is why a well-built palette can re-rank the
        whole list <em>on every keystroke</em> and still feel instant. That
        budget question - what has to happen inside one frame - is a topic of
        its own; we cover it in{" "}
        <Link href="/blog/what-makes-a-file-manager-fast">
          What makes a file manager fast?
        </Link>
      </p>

      <h2>Where you&apos;ve already used this</h2>
      <p>
        Fuzzy matching quietly became a standard interface: Sublime
        Text&apos;s Goto Anything popularized it in 2008, VS&nbsp;Code&apos;s{" "}
        <code>⌘P</code> made it universal, <code>fzf</code> brought it to the
        shell, and launchers like Alfred and Raycast brought it to the whole
        OS. File managers were late to the party - Finder still offers only
        exact-prefix &quot;type-select&quot; and full Spotlight search, with
        nothing in between.{" "}
        <Link href="/">Shuffle</Link>&apos;s <code>⌘P</code> palette exists
        precisely to fill that gap: typo-tolerant fuzzy search over your home
        directory, with the same subsequence-plus-boundaries scoring you just
        played with above - tuned so results update in about a millisecond.
      </p>

      <div className="callout">
        <p>
          <strong>The recipe</strong> - match query characters as an in-order
          subsequence; score runs, word boundaries, gaps, and length; forgive
          small edit distances at a penalty; index once and re-rank per
          keystroke. Thirty lines gets you 80% of the way - the last 20% is
          weights and speed.
        </p>
      </div>
    </>
  );
}
