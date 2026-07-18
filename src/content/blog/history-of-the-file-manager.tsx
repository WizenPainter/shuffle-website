import Link from "next/link";
import FileManagerTimeline from "./interactive/FileManagerTimeline";

export default function HistoryOfTheFileManager() {
  return (
    <>
      <p>
        Every computer you have ever used has needed an answer to the same
        question: <em>how does a person find, move, copy, and delete their
        files?</em> The answers have ranged from typed incantations on a
        teletype to icons you drag with a fingertip, and the history of those
        answers is quietly one of the best lenses on the history of computing
        itself. Each era&apos;s file manager encodes what its designers
        believed about users — that they were operators, or clerks, or
        creatives, or people who should never see a file at all. This is the
        story of how we got from <code>COPY A:*.* B:</code> to GPU-rendered
        windows, in five acts.
      </p>

      <FileManagerTimeline />

      <h2>Act I: the command line was the file manager</h2>
      <p>
        For the first decades of computing there was no &ldquo;file
        manager&rdquo; as a category, because managing files <em>was</em> what
        the operating system&apos;s interface did. When Unix appeared at Bell
        Labs in 1971, its First Edition manual already documented the verbs
        programmers still type today: <code>ls</code> to list, <code>cp</code>{" "}
        to copy, <code>mv</code> to move, <code>rm</code> to remove. The
        philosophy was radical in its plainness — files were byte streams,
        directories were files that listed other files, and file management
        was just small programs composed in a shell.
      </p>
      <p>
        The microcomputer world inherited a similar model by a different
        route. Gary Kildall&apos;s CP/M, written in the mid-1970s, gave early
        personal computers a <code>DIR</code> command and copied files with{" "}
        <code>PIP</code> — the Peripheral Interchange Program, a name and tool
        borrowed from DEC&apos;s minicomputer operating systems, complete with
        its backwards-feeling <em>destination-first</em> syntax. When IBM
        needed an operating system for the PC in 1981, Microsoft supplied
        MS-DOS, a system so closely modeled on CP/M that its file commands —{" "}
        <code>DIR</code>, <code>COPY</code>, <code>DEL</code>,{" "}
        <code>TYPE</code> — felt like translations. (What those commands were
        actually manipulating on disk is a story of its own; we walk through
        it in{" "}
        <Link href="/blog/how-the-dos-fat-file-system-worked">
          how the DOS FAT file system worked
        </Link>
        .)
      </p>
      <p>
        Even the mainframe world, where &ldquo;users&rdquo; were institutions,
        found directory-tending painful enough to automate. IBM&apos;s VM
        operating system family gained DIRMAINT — the Directory Maintenance
        facility — a program whose whole job was safely editing the system
        directory that defined every user and their disks, because doing it by
        hand was slow and error-prone. The pattern that would drive every file
        manager since was already visible: wherever humans manage a hierarchy
        by typing at it, someone eventually builds a tool to do it visually
        and safely.
      </p>

      <h2>Act II: the TUI managers — full-screen text, full-speed hands</h2>
      <p>
        The command line&apos;s weakness was never power; it was{" "}
        <em>visibility</em>. You could not see your disk. You typed{" "}
        <code>DIR</code>, read a scrolling listing, held it in your head, and
        typed the next command blind. In the mid-1980s, as PCs spread to
        offices full of people who were not programmers, a wave of{" "}
        <strong>text-mode file managers</strong> fixed exactly that.
      </p>
      <p>
        PathMinder, from Westlake Data of Austin, Texas, shipped in late 1984
        as one of the earliest DOS shells. Then in April 1985 came the
        category&apos;s first star: <strong>XTree</strong>, from Executive
        Systems. XTree drew your entire disk as a navigable tree of
        directories — a picture of the hierarchy, in characters — and
        introduced an idea power users still cherish: <em>tagging</em>{" "}
        multiple files and applying one operation to all of them. Against
        typing <code>COPY</code> commands one file at a time, it felt like
        cheating, and reviewers of the era treated it as the tool to beat.
      </p>
      <p>
        The tool that actually beat it arrived in May 1986.{" "}
        <strong>Norton Commander</strong>, written by John Socha and published
        by Peter Norton Computing, put <em>two</em> directory listings side by
        side — source and destination — and bound every common operation to a
        function key along the bottom of the screen: F5 to copy, F6 to move,
        F8 to delete. No mode switches, no retyping paths, no ambiguity about
        where a file would land. The design was so complete that it became a
        genre, the &ldquo;orthodox file manager,&rdquo; and it is still being
        cloned four decades later — we wrote a whole essay on{" "}
        <Link href="/blog/dual-pane-file-managers">
          why the dual-pane layout refuses to die
        </Link>
        . Even Microsoft conceded the point, shipping DOS Shell with MS-DOS
        4.0 in 1988.
      </p>

      <h2>Act III: the GUI revolution — files become things</h2>
      <p>
        Meanwhile, a completely different answer had been taking shape in Palo
        Alto. Building on a decade of research around the Alto, Xerox shipped
        the <strong>8010 Star</strong> in April 1981 — the first commercial
        system where files were <em>icons</em>: little pictures of documents
        and folders sitting on a desktop, moved by dragging, printed by
        dropping them on a printer icon. The Star was a commercial failure —
        it cost more than a car and sold in small numbers — but as a statement
        of interface design it may be the most influential flop in computing.
        Its designers had inverted the grammar: instead of naming a command
        and then its object (<code>COPY file</code>), you selected the object
        and then chose what to do with it.
      </p>
      <p>
        Apple carried the idea to market twice — first with the Lisa in 1983,
        expensive and short-lived, and then in January 1984 with the
        Macintosh. The Mac&apos;s file manager, the{" "}
        <strong>original Finder</strong>, written by Bruce Horn and Steve
        Capps, committed fully to what would later be called the{" "}
        <strong>spatial model</strong>: every folder opened as one and only
        one window, and that window permanently remembered its position, its
        size, and where you had placed each icon inside it. Files were not
        entries in a listing; they were <em>things</em> with locations, and
        your spatial memory did the indexing. For hierarchies of 1984 — a few
        hundred files on a 400&nbsp;KB floppy — it was a genuinely brilliant
        fit.
      </p>
      <p>
        The rest of the decade filled in variations. Commodore&apos;s Amiga
        Workbench (1985) brought a colorful multitasking desktop that called
        its folders &ldquo;drawers.&rdquo; Digital Research&apos;s GEM (also
        1985) put a Mac-like desktop on cheap PCs and the Atari ST —
        Mac-like enough that Apple sued, and the PC version&apos;s desktop
        was legally defanged. The desktop metaphor had become the obvious
        future; the only question was whose implementation would win.
      </p>

      <h2>Act IV: the Windows lineage, from Executive to Explorer</h2>
      <p>
        Microsoft&apos;s first attempt barely qualified as a metaphor at all.
        Windows 1.0 (1985) shipped with <strong>MS-DOS Executive</strong>,
        essentially a mouse-clickable <code>DIR</code> listing — file names in
        columns, no icons, no drag-and-drop. Windows 3.0 in 1990 replaced it
        with <strong>File Manager</strong> (<code>winfile.exe</code>), and
        this is the program that taught a hundred million office workers what
        file management looked like: a directory tree in the left pane, the
        selected folder&apos;s contents on the right, drag to copy. It was
        neither spatial nor orthodox — it was a <em>navigational browser</em>,
        one window through which you steered. (File Manager has had a strange
        afterlife: Microsoft open-sourced it in 2018, and the 1990 design
        still runs happily on Windows 11.)
      </p>
      <p>
        Windows 95&apos;s <strong>Explorer</strong> completed the design and,
        in effect, ended the argument. One window, a hierarchy pane, a
        contents pane, and — crucially — <em>browser semantics</em>: you
        navigated forward into folders and clicked Back to retrace, exactly
        like the web browsers arriving in the same years. Explorer&apos;s
        model was so successful that it colonized everything, including its
        old rival: when Mac OS X arrived in 2001, the new Finder had quietly
        become a navigational browser too, with a toolbar and Back button,
        and the classic spatial Finder&apos;s partisans mourned it in essays
        that are still worth reading. The taxonomy of these competing designs
        — spatial, navigational, orthodox, and one more besides — is rich
        enough that we gave it{" "}
        <Link href="/blog/file-manager-archetypes">its own article</Link>.
      </p>

      <h2>Act V: search, and the strange disappearance of the file</h2>
      <p>
        Then hierarchies themselves came under attack. Disks had grown from
        hundreds of files to hundreds of thousands, and the assumption
        underneath every file manager since the Star — that a human would
        file things in folders and remember where — was buckling. The
        mid-2000s made search the escape hatch. Gmail launched in 2004 with
        the explicit pitch that you should <em>search, not sort</em>. Apple
        shipped <strong>Spotlight</strong> in Mac OS X 10.4 Tiger in 2005:
        every file&apos;s name, metadata, and contents indexed continuously,
        any file summonable by typing a few characters. Microsoft chased the
        same dream more ambitiously and publicly failed — WinFS, the
        database-like file system meant to anchor Windows Longhorn, was
        cancelled in 2006.
      </p>
      <p>
        Mobile pushed the logic to its endpoint. The iPhone launched in 2007
        with <em>no user-visible file system at all</em> — data belonged to
        apps, and finding things meant search, recents, and app switching.
        For a while this looked like the future of all computing, and a
        generation raised on it famously arrived in university labs unsure
        what a folder even was. But the pure model leaked: people needed to
        get one file from one app into another, attach things, organize
        projects. Apple blinked in 2017, adding the Files app to iOS 11 — a
        real, if modest, file manager on the platform designed to never need
        one. Files, it turns out, are not an implementation detail. They are
        how people hold work they own.
      </p>

      <h2>Act VI: the renaissance</h2>
      <p>
        Which brings the story to now, and to an odd fact: the file manager,
        pronounced boring or obsolete for twenty years, is interesting again.
        The power-user lineage never actually died — Total Commander has been
        continuously developed since 1993, Midnight Commander since 1994, and
        macOS has a deep bench of Finder alternatives — but the new energy
        comes from somewhere unexpected: <strong>rendering</strong>. Mainstream
        file browsers still draw their windows with general-purpose UI
        toolkits designed decades ago, and it shows the moment a directory
        holds fifty thousand entries. A new generation of developers, several
        of them from the games industry, looked at that and asked why a file
        window should not be rendered like a game — on the GPU, at 120
        frames per second, with the whole interface budgeted in milliseconds.
      </p>
      <p>
        On Windows, File Pilot — built by ex-game-developer Vjekoslav
        Krajačić and released in beta in early 2025 — demonstrated what that
        feels like: a two-megabyte executable that opens enormous folders
        without a stutter. On macOS, <Link href="/">Shuffle</Link> applies
        the same conviction with Rust and GPUI, the GPU-accelerated framework
        behind the Zed editor — and folds the whole history above into one
        free, open-source app: Explorer-style navigation, Norton-style dual
        panes, and a fuzzy command palette descended from the search era. How
        that gets built is its own story, told in{" "}
        <Link href="/blog/building-shuffle-rust-gpui">
          Building a GPU-rendered file manager in Rust with GPUI
        </Link>
        .
      </p>
      <p>
        Sixty years in, the file manager keeps returning because the problem
        keeps returning. Hierarchies were supposed to be replaced by search;
        search became one tool among several. Files were supposed to be
        hidden by apps and clouds; they came back, because ownership needs an
        object. Whatever the next interface era looks like, somewhere in it
        there will be a window — or a prompt, or a palette — whose job is the
        oldest one in computing: show me my files, and let me act on them.
      </p>

      <div className="callout">
        <p>
          <strong>TL;DR</strong> — file management began as typed commands
          (Unix 1971, CP/M, DOS), became visible with text-mode tools (XTree
          1985, Norton Commander 1986), turned into icons and windows (Xerox
          Star 1981, Mac Finder 1984), consolidated on the navigational
          browser (Windows 95 Explorer), was half-replaced by search
          (Spotlight 2005) and hidden by mobile — and is now being rebuilt
          for speed by GPU-rendered apps like File Pilot and{" "}
          <Link href="/">Shuffle</Link>.
        </p>
      </div>
    </>
  );
}
