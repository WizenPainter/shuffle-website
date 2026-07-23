import Link from "next/link";
import VirtualizationDemo from "./interactive/VirtualizationDemo";

export default function WhatMakesAFileManagerFast() {
  return (
    <>
      <p>
        &quot;Fast&quot; is not a marketing adjective - it is a number with
        a deadline. A file manager feels fast when every response to your
        input lands inside a frame or two, and feels slow the moment
        anything - a scroll, a keystroke, opening a folder - misses that
        deadline. This article is about where the deadline comes from, why
        the obvious way to build a file browser blows through it at scale,
        and the four engineering pillars that the genuinely fast ones all
        share. There is a live demo halfway down that lets you feel the
        difference directly.
      </p>

      <h2>The perceptual budget</h2>
      <p>
        A 60&nbsp;Hz display refreshes every <strong>16.7&nbsp;ms</strong>;
        the 120&nbsp;Hz ProMotion panels on recent MacBook Pros every{" "}
        <strong>8.3&nbsp;ms</strong>. Everything an application does in
        response to a scroll event - process input, update state, lay out the
        UI, rasterize it, hand a frame to the compositor - has to fit inside
        that window, every window, or the animation visibly stutters. Humans
        are poor at noticing absolute latency but excellent at noticing{" "}
        <em>dropped frames</em>: a scroll that hitches for 50&nbsp;ms reads
        as broken even though 50&nbsp;ms is objectively a short time.
      </p>
      <p>
        Discrete actions get a little more slack. Research on input latency
        going back to Card and Miller&apos;s work in the 1980s converges on
        roughly <strong>100&nbsp;ms</strong> as the threshold below which a
        response feels instantaneous - the keystroke-to-paint budget. But
        100&nbsp;ms is a ceiling, not a target: typists can distinguish
        editor latencies well below it, which is why fast editors chase
        single-digit keystroke-to-photon times. For a file manager the
        equivalent moments are opening a directory, typing in a filter or
        search field, and switching tabs. Fit those under one frame and the
        tool disappears; take 300&nbsp;ms and the user feels every one.
      </p>
      <p>
        It is worth being precise about what the budget must cover, because
        the pipeline is longer than it looks. Between your key going down
        and photons changing, the OS delivers the event, the app updates
        its model, computes layout, rasterizes the result, and submits a
        frame that waits for the next display refresh. Miss the refresh by
        a microsecond and the frame waits a full extra cycle - latency
        quantizes. That is why performance work on interactive software
        obsesses over the <em>worst</em> frame, not the average one: an app
        that renders in 2&nbsp;ms usually but 40&nbsp;ms occasionally feels
        worse than one that takes a steady 8.
      </p>

      <h2>Where the naive design dies</h2>
      <p>
        The straightforward way to build a file browser - read the
        directory, make a widget per file, show them in a scroll view - 
        works beautifully in a folder of 40 items and collapses in a folder
        of 100,000. Three specific mistakes account for most of the
        collapse:
      </p>
      <ul>
        <li>
          <strong>One UI node per file.</strong> Whether it&apos;s DOM
          elements in an Electron app or views in a native one, 100,000
          nodes means 100,000 objects to allocate, measure, lay out, and
          keep in memory. Layout cost scales with node count, so the price
          is paid not once but on <em>every</em> resize, sort, and style
          change. No widget system - browser or native - survives this
          gracefully.
        </li>
        <li>
          <strong>Synchronous metadata.</strong> A name listing is one cheap
          call, but the size, dates, and permissions shown next to each name
          require a <code>stat()</code> per file. Do that inline while
          building the list and you have serialized 100,000 system calls - 
          and on a network volume, potentially 100,000 round trips - before
          the first row paints. This is the classic beachball: the UI thread
          is not rendering because it is waiting on a disk.
        </li>
        <li>
          <strong>Thumbnails on the UI thread.</strong> Generating a preview
          means decoding an image or rendering a PDF page - tens to hundreds
          of milliseconds each. Doing even one of these between frames blows
          the budget; doing them for a folder of RAW photos freezes the app
          for minutes.
        </li>
      </ul>
      <p>
        Note that none of these is a slow-language problem. A C program that
        stats 100,000 files synchronously on the UI thread beachballs
        exactly like a JavaScript one. The fixes are architectural.
      </p>

      <h2>Pillar 1: virtualized lists</h2>
      <p>
        The first fix attacks node count. A 300-pixel-tall viewport over
        28-pixel rows can display about eleven rows - so render about
        eleven rows. A <strong>virtualized</strong> (or
        &quot;windowed&quot;) list keeps the full item array in memory as
        cheap data, renders only the slice that intersects the viewport
        plus a few <em>overscan</em> rows on either side, and positions
        them inside a spacer element sized to the full list so the
        scrollbar stays honest. On every scroll event it recomputes the
        slice - two divisions and an array slice, microseconds of work - 
        and lets the rows that scrolled out be recycled.
      </p>
      <p>
        The result is that rendering cost is proportional to viewport
        height, not directory size. A 50,000-file folder costs the same
        thirty rows as a 50-file one. Try it:
      </p>
      <VirtualizationDemo />
      <p>
        Every fast list you use daily works this way - VS&nbsp;Code&apos;s
        file tree, Slack&apos;s message pane, your Twitter feed - and every
        fast file manager does too. Virtualization is the single highest
        leverage technique on this list: without it, nothing else matters,
        because layout alone will eat the frame budget.
      </p>
      <p>
        The technique has sharp edges worth knowing about. Fixed row
        heights make the math trivial - row <em>n</em> lives at{" "}
        <code>n x height</code> - which is one quiet reason dense,
        uniform-row file listings are easier to make fast than
        variable-height feeds. Overscan (rendering a few extra rows beyond
        each edge) hides the seam during fast flicks. And selection, focus,
        and keyboard navigation must live in the <em>data</em> layer, not
        the widgets - the row object for a selected file may not exist at
        all while it is scrolled offscreen, so any state stored on widgets
        evaporates. Get that separation right and virtualization is nearly
        invisible; get it wrong and you ship the classic bug where
        scrolling away and back clears the user&apos;s selection.
      </p>

      <h2>Pillar 2: async I/O - never block the render thread</h2>
      <p>
        The second fix attacks the beachball. The rule is absolute: the
        thread that produces frames must never wait on a disk, a network
        volume, or a cloud sync daemon. Every filesystem operation happens
        on background threads, and results <em>stream</em> into the UI as
        they arrive:
      </p>
      <ul>
        <li>
          The directory <strong>name listing</strong> comes first - it is
          one cheap kernel call - so rows appear with names immediately.
        </li>
        <li>
          <strong>Metadata</strong> (sizes, dates, kinds) is fetched in
          batches, prioritized for the rows currently on screen, and filled
          in as it lands. A briefly blank size column is imperceptible; a
          frozen window is not.
        </li>
        <li>
          <strong>Thumbnails</strong> are generated by a worker pool with a
          cache, and requests for rows that scroll away are cancelled
          rather than completed.
        </li>
      </ul>
      <p>
        Streaming changes the failure mode, which matters more than the
        average case. When a network share takes four seconds to answer, an
        async design shows the window instantly with rows populating as
        data arrives - degraded but alive, scrollable, cancellable. A
        synchronous design shows a beachball and a decision: wait, or force
        quit.
      </p>

      <h2>Pillar 3: GPU rendering</h2>
      <p>
        Virtualization and async I/O decide <em>what</em> work happens per
        frame; the third pillar decides <em>where</em>. Traditional
        desktop toolkits rasterize their widgets on the CPU and composite
        the results; Electron apps add a browser engine&apos;s DOM, style,
        and layout machinery on top of that before Chromium&apos;s
        compositor ever runs. Both can be made smooth, but the per-frame
        ceiling is low and the layers between your data and the screen are
        thick.
      </p>
      <p>
        The newer approach - used by the Zed editor&apos;s{" "}
        <strong>GPUI</strong> framework, and by Shuffle, which is built on
        it - treats the UI the way a game engine treats a scene. The
        application keeps a retained tree of elements, lays it out with a
        flexbox engine, and then, instead of asking the CPU to paint
        pixels, emits the whole frame as geometry: quads, glyphs from a
        cached atlas, rounded rectangles and shadows evaluated in shaders.
        The GPU - via <strong>Metal</strong> on macOS - rasterizes the lot
        in well under a millisecond. Scrolling a list becomes what GPUs are
        built for: drawing a few hundred textured quads at new offsets.
      </p>
      <p>
        The point is not that GPUs make slow code fast - a blocked thread
        blocks at any clock speed. The point is headroom: when rasterization
        costs a fraction of the 8&nbsp;ms budget instead of most of it,
        there is room left for the application to do real work - filtering,
        matching, layout - inside the same frame, and 120&nbsp;Hz stops
        being aspirational. We wrote about building on this stack in{" "}
        <Link href="/blog/building-shuffle-rust-gpui">
          Building a GPU-rendered file manager in Rust with GPUI
        </Link>
        .
      </p>

      <h2>Pillar 4: caching and indexing</h2>
      <p>
        The final pillar is refusing to recompute what you already know.
        Fast file managers cache aggressively - sorted directory listings,
        icon lookups, thumbnails on disk, natural-sort keys - and invalidate
        by <em>watching</em> rather than polling: on macOS, the FSEvents API
        delivers change notifications per directory, so a cached listing
        stays trustworthy until the OS says otherwise.
      </p>
      <p>
        Indexing is caching&apos;s ambitious sibling. A search-as-you-type
        command palette cannot walk your home directory per keystroke - half
        a million paths at even a few microseconds each is far too slow, and
        the disk touches would be brutal. So the index is built once, in the
        background, and kept warm by the same change events; each keystroke
        then runs against a compact in-memory list, where fuzzy-matching and
        ranking half a million paths takes single-digit milliseconds. How
        that matching actually works - subsequence scanning, boundary
        bonuses, typo tolerance - is its own story, told in{" "}
        <Link href="/blog/how-fuzzy-search-works">
          How fuzzy search works
        </Link>
        .
      </p>
      <p>
        Caching has one law: a wrong cache is worse than no cache, because a
        stale listing shows the user files that are not there. This is why
        the watching half matters as much as the storing half - the cache is
        only as good as its invalidation, and invalidation driven by OS
        change events is the difference between a cache you can trust and
        one you nervously bypass with a manual refresh key.
      </p>

      <h2>Why Finder and Explorer choose differently</h2>
      <p>
        None of this is secret, so why do the built-in file managers feel
        the way they do? Because they optimize for different things. Finder
        prioritizes rich previews, cloud integration, and per-folder view
        state; several of its costs - thumbnail generation, recursive
        &quot;calculate all sizes,&quot; <code>.DS_Store</code>{" "}
        round-trips on network shares - are features doing exactly what they
        were asked to, at prices that only become visible in big
        directories (we catalogued them, with fixes, in{" "}
        <Link href="/blog/why-is-finder-slow">Why is Finder so slow?</Link>
        ). Windows Explorer makes a parallel set of trades, famously
        blocking folder views on shell extensions and network metadata. Both
        are general-purpose consumer surfaces first and file browsers
        second - a defensible priority that no settings checkbox can undo.
      </p>

      <h2>All four at once</h2>
      <p>
        The pillars compound: virtualization keeps per-frame work bounded,
        async I/O keeps the render thread free to do it, GPU rendering makes
        the frame itself nearly free, and caching means most questions are
        answered before they are asked.{" "}
        <Link href="/">Shuffle</Link> - a free, open source Finder
        alternative for macOS - is an attempt to apply all four without
        compromise: virtualized panes rendered through Metal via GPUI, all
        filesystem work off-thread, FSEvents-driven updates, and a
        background home-directory index behind its <code>⌘P</code> palette.
        The test is simple and you can run it today: open your biggest,
        ugliest directory and start scrolling.
      </p>

      <div className="callout">
        <p>
          <strong>TL;DR</strong> - speed is a budget: 8-16&nbsp;ms per frame,
          ~100&nbsp;ms per action. Naive designs die on 100k UI nodes,
          synchronous <code>stat()</code> calls, and UI-thread thumbnails.
          The fast ones all do four things: render only visible rows, keep
          disk I/O off the render thread, rasterize on the GPU, and cache
          and index so answers are precomputed.{" "}
          <Link href="/">Shuffle</Link> does all four - free and open
          source.
        </p>
      </div>
    </>
  );
}
