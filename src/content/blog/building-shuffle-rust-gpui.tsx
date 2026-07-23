import Link from "next/link";

export default function BuildingShuffleRustGpui() {
  return (
    <>
      <p>
        Shuffle is a file manager for macOS - dual panes, tabs, a fuzzy
        command palette, a terminal mode - written in Rust on{" "}
        <strong>GPUI</strong>, the GPU-accelerated UI framework that powers
        the Zed editor, with every frame rasterized through Metal. It is
        free and MIT-licensed, and the source is{" "}
        <a
          href="https://github.com/WizenPainter/shuffle"
          target="_blank"
          rel="noopener noreferrer"
        >
          on GitHub
        </a>
        . This post is the engineering story: why build a Finder alternative
        at all, why this unusual stack, what building on a framework with
        almost no documentation is actually like, and the parts that turned
        out to be much harder than they looked.
      </p>

      <h2>Why build a file manager in 2026</h2>
      <p>
        A file manager is about the least glamorous software you can write.
        It is also the tool many of us touch more than any other except the
        editor and the browser - and on macOS, the state of the art has been
        stuck for a long time. Finder is polished but structurally slow in
        large directories and thin on power features. The third-party
        alternatives largely split into two camps: feature-rich apps built
        on conventional AppKit patterns that carry noticeable weight, and
        fast minimal ones that stay minimal. What did not exist was the
        combination: genuinely instant <em>and</em> genuinely capable.
      </p>
      <p>
        The push to actually start came from watching Windows, of all
        places. File Pilot - a file manager written from scratch in C with
        its own GPU renderer - demonstrated that the category ceiling was an
        illusion: directories with hundreds of thousands of entries opening
        in milliseconds, a UI that never dropped a frame, an install
        measured in single-digit megabytes. Nothing like it existed for
        macOS. The techniques were not proprietary - they are the same four
        pillars we later wrote up in{" "}
        <Link href="/blog/what-makes-a-file-manager-fast">
          What makes a file manager fast?
        </Link>{" "}
        - someone just had to sit down and apply them to this platform.
      </p>

      <h2>Why Rust</h2>
      <p>
        The honest answer has three parts. First, the performance profile:
        a file manager is systems software wearing a UI - it walks huge
        directory trees, watches the filesystem, indexes half a million
        paths, and must never hitch while doing any of it. Rust gives
        C-level control over allocation and layout with no garbage
        collector to pause a frame at the wrong moment. Second, fearless
        concurrency is not a slogan here: almost everything interesting in
        Shuffle happens off the main thread - directory scans, metadata
        batches, the search index, thumbnail generation - and the borrow
        checker turns a whole class of data races between those threads and
        the UI into compile errors. Third, and decisively: GPUI is a Rust
        framework. Choosing the renderer chose the language.
      </p>
      <p>
        The less obvious win was the ecosystem around the edges. A file
        manager talks to the operating system constantly, and the Rust
        crates for that conversation are mature: bindings for calling into
        Objective-C and the macOS frameworks, filesystem notification
        wrappers, archive formats, image decoding. Where a binding did not
        exist we wrote thin FFI shims over the C and Objective-C APIs
        directly - tedious the first time, uneventful after that. The
        pattern that emerged is a native core with platform tendrils: Rust
        owns state, logic, and rendering, and small unsafe bridges own the
        conversations with AppKit that no cross-platform layer can have for
        you.
      </p>

      <h2>What GPUI actually is</h2>
      <p>
        GPUI is the UI framework the Zed team built when they concluded no
        existing toolkit could hit their latency targets. It lives in the
        Zed repository, is developed primarily in service of Zed, and is
        usable by third parties - with caveats we will get to. Its design
        mixes ideas that rarely appear together:
      </p>
      <ul>
        <li>
          <strong>Hybrid retained / immediate mode.</strong> Application
          state lives in long-lived entities, but the element tree is
          rebuilt each time a view renders, immediate-mode style. You get
          the &quot;UI as a function of state&quot; mental model React
          popularized, without a browser attached.
        </li>
        <li>
          <strong>GPU rasterization via Metal.</strong> Elements are not
          painted into CPU bitmaps. Each frame is emitted as primitives - 
          quads, shadows, paths, glyph runs from a cached atlas - and
          shaders rasterize them. Frame cost is so low that 120&nbsp;Hz
          ProMotion is the normal case, not the stretch goal.
        </li>
        <li>
          <strong>The entity/context model.</strong> State lives in{" "}
          <code>Entity&lt;T&gt;</code> handles owned by the framework;
          reading or updating one goes through a context (the{" "}
          <code>cx</code> argument threaded through every GPUI function),
          which is also the capability for spawning async tasks, subscribing
          to other entities, and requesting redraws. It feels ceremonious
          for a week and then it feels like the reason the app has no
          data-race bugs.
        </li>
        <li>
          <strong>Flexbox layout, Tailwind-flavored API.</strong> Layout is
          computed by Taffy, the Rust flexbox engine, and styled through
          chainable methods - <code>div().flex().gap_2().w_full()</code> - 
          that read like utility classes. Coming from web tooling, this part
          is home turf.
        </li>
      </ul>

      <h2>Building on GPUI as a third party</h2>
      <p>
        Here is the caveat: GPUI is young, and Zed is both its author and
        its overwhelmingly primary user. There is no book, no cookbook, and
        only the beginnings of API documentation. The framework ships as a
        crate you pin to a revision of the Zed repository, and its API still
        moves - an update can rename methods and rework signatures, and
        upgrading is a small porting project you schedule rather than a
        version bump you absorb.
      </p>
      <p>
        We knew this going in, and chose it anyway, because the alternatives
        each failed a requirement. AppKit is mature but its table views and
        layout machinery were not designed around the frame budgets we
        wanted; Electron fails the premise outright; the cross-platform
        Rust toolkits were younger than GPUI with less production mileage.
        GPUI was the only option that had already proven, in a shipping
        product with demanding users, that it could hold 120&nbsp;Hz under
        real workloads. We were trading documentation for evidence.
      </p>
      <p>
        The documentation that does exist is Zed itself. This sounds worse
        than it is: Zed is a large, production-quality GPUI application with
        readable source, so nearly every question has an answer somewhere in
        it. How do you build a virtualized list? Read{" "}
        <code>uniform_list</code> and its call sites. How does focus
        management work? Zed&apos;s panels show you. What does a correct
        keymap integration look like? It is in there too. A real fraction of
        early Shuffle development was two windows side by side: our code on
        the left, Zed&apos;s on the right. You also inherit the
        framework&apos;s scope: GPUI provides elements and primitives, not a
        widget library, so the higher-level components an AppKit developer
        takes for granted - text fields, menus, tooltips, scrollbars - are
        yours to build. That cost buys total control over behavior and
        pixels, which for this app was the entire point.
      </p>

      <h2>The architecture that fell out</h2>
      <p>
        <strong>Virtualized everything.</strong> Every file list in Shuffle
        is windowed: the directory listing is data in memory, and only the
        rows intersecting the viewport are built into elements each frame.
        GPUI&apos;s design makes this natural - since the element tree is
        reconstructed per render anyway, a virtualized list is just a render
        function that loops over a computed range instead of the whole
        vector. Directory size stopped being a performance variable almost
        by construction.
      </p>
      <p>
        <strong>A background index behind ⌘P.</strong> The fuzzy palette is
        the feature Shuffle exists for, and it only works if results update
        within a keystroke. An indexer walks your home directory on a
        background thread at startup and keeps the paths in a compact
        in-memory structure; each keystroke runs a subsequence-plus-scoring
        pass over it - the algorithm family described in{" "}
        <Link href="/blog/how-fuzzy-search-works">
          How fuzzy search works
        </Link>{" "}
        - in about a millisecond. The render thread never touches the disk;
        it only ever ranks memory. GPUI&apos;s task model makes the
        handoff clean: the palette entity spawns the scoring work onto a
        background executor and awaits it, and when results land the
        context notifies the view, which re-renders on the next frame. If a
        newer keystroke has arrived in the meantime, the stale task&apos;s
        results are simply dropped - cancellation by supersession, no locks
        involved.
      </p>
      <p>
        <strong>Metadata streams; names come first.</strong> Opening a
        directory issues the cheap name listing immediately and paints rows
        with names alone, then fills in sizes, dates, and icons as
        background batches complete - prioritized for whatever is on
        screen. The same discipline applies to the built-in terminal mode
        and the in-place <code>/</code> filter: both operate on state
        already in memory, so their response cost is a render, not an I/O
        wait.
      </p>
      <p>
        <strong>Event-driven, not polled.</strong> Cached state is only
        trustworthy if invalidation is reliable, so Shuffle leans on
        FSEvents, macOS&apos;s filesystem notification API. Open panes
        subscribe to their directories and update when the OS reports a
        change; the same stream keeps the search index warm as files come
        and go. FSEvents coalesces rapid changes, which is a feature - a
        build system spraying ten thousand writes becomes a handful of
        refreshes rather than ten thousand.
      </p>
      <p>
        <strong>Borrow the platform where it wins.</strong> Rewriting
        QuickLook would be madness: every renderer for PDFs, videos, Office
        documents and RAW photos already ships with macOS. Shuffle bridges
        to the native Quick Look machinery for space-bar previews and
        thumbnails, which means previews behave exactly as they do in
        Finder - plugins included.
      </p>
      <p>
        <strong>Theming as data.</strong> Because GPUI computes every color
        and metric at render time rather than baking them into platform
        widgets, deep theming came almost free. Shuffle&apos;s themes are
        declarative files covering the full surface - panes, palette,
        terminal - and switching one is just new values flowing through the
        next frame. The discipline it imposed was healthy, too: no
        component is allowed a hardcoded color, so the entire UI is forced
        through one design vocabulary, and a new theme is an afternoon of
        writing values rather than a fork of the rendering code.
      </p>

      <h2>The hard parts, honestly</h2>
      <p>
        <strong>Text editing from scratch.</strong> The single most
        humbling component was the humble text field. GPUI gives you glyph
        runs and input events; everything above that - cursor, selection,
        IME composition, clipboard, undo - is application code. Users bring
        thirty years of muscle memory to a text field, and every missing
        detail registers as a bug. The long tail is real: we recently
        shipped word-wise selection - <kbd>⌥⇧←</kbd>/<kbd>⌥⇧→</kbd>{" "}
        extending the selection word by word, matching <kbd>⌥←</kbd>{" "}
        word-jumps - in the palette and the path bar. On any mature toolkit
        that behavior is free. Here it was a deliberate feature, shipped in
        a release, because word boundaries, selection anchors, and
        extension direction all had to be written down. Multiply that by
        every text-field convention macOS has taught you and you understand
        where the time went.
      </p>
      <p>
        <strong>Drag-and-drop between panes.</strong> Dual panes exist so
        you can drag files between them, and drag-and-drop sits exactly on
        the seam between our renderer and the platform. Within a window,
        GPUI sees the drag; the moment it must interoperate with Finder and
        other apps, it becomes NSPasteboard types, file promises, and
        spring-loaded drop targets - AppKit conventions that assume AppKit
        views. Bridging the two models, keeping hit-testing honest across
        panes, and rendering drag previews that track the cursor at
        120&nbsp;Hz took several rewrites before it felt native rather than
        merely functional.
      </p>
      <p>
        <strong>Shipping to Macs that aren&apos;t ours.</strong>{" "}
        Distribution outside the App Store means Developer&nbsp;ID signing,
        the hardened runtime, notarization via <code>notarytool</code>, and
        stapling the ticket - a pipeline where each stage fails with a
        different quality of error message. Notarization in particular is a
        black box that says &quot;invalid&quot; until every nested binary
        in the bundle is signed in the right order with the right
        entitlements. It is all automated now and boring, which is the goal;
        getting there consumed a solid week nothing about building the
        actual app had prepared us for.
      </p>

      <h2>Would we choose this stack again?</h2>
      <p>
        Yes - with clear eyes. The costs were real: months of building
        table-stakes widgets, a dependency that moves under us, and the
        constant discipline of a framework that hands you power tools
        without guardrails. But the costs were paid once, up front, and the
        benefits compound daily. Performance is not a feature we optimize
        toward; it is the default the architecture produces, and the
        interesting work now happens on top of it. The counterfactuals are
        unconvincing: an AppKit app would have shipped sooner and hit a
        ceiling we could not raise, and an Electron app would have
        contradicted the entire premise - you cannot credibly promise a
        file manager faster than Finder while shipping a browser to render
        it. For an app whose whole identity is latency, the renderer is not
        an implementation detail. It is the product decision.
      </p>

      <h2>What&apos;s next</h2>
      <p>
        Shuffle is free, open source under MIT, and will stay that way - the
        core file manager is not going behind anything. The sustainability
        plan is a <strong>Pro tier as a one-time purchase</strong>:
        additions for people who live in a file manager all day, paid for
        once. No subscription, because a file manager that stops working
        when a payment lapses is a file manager you cannot trust with your
        files. Near-term engineering work is more of what the architecture
        was built for: richer batch operations, deeper cloud-drive
        integration, and continuing to sand down the text-editing and
        drag-and-drop long tails.
      </p>
      <p>
        If any of this sounds like your kind of problem, the code is{" "}
        <a
          href="https://github.com/WizenPainter/shuffle"
          target="_blank"
          rel="noopener noreferrer"
        >
          on GitHub
        </a>{" "}
        and issues and PRs are welcome. And if you just want a faster file
        manager, <Link href="/">Shuffle</Link> runs on macOS&nbsp;12 and
        later - open your worst directory and see.
      </p>

      <div className="callout">
        <p>
          <strong>TL;DR</strong> - we built a Finder alternative in Rust on
          GPUI, Zed&apos;s Metal-backed UI framework: virtualized lists,
          a background index behind the <code>⌘P</code> palette, FSEvents
          for invalidation, native QuickLook, themes as data. The young
          ecosystem means reading Zed&apos;s source as documentation and
          building text editing and drag-and-drop yourself - the payoff is
          a file manager that holds 120&nbsp;Hz. Free, MIT,{" "}
          <Link href="/">shuffleapp.co</Link>; Pro will be a one-time
          purchase, never a subscription.
        </p>
      </div>
    </>
  );
}
