import Link from "next/link";

export default function WhyIsFinderSlow() {
  return (
    <>
      <p>
        Open a folder with ten thousand files in it and Finder hesitates. Click
        into a directory on a network share and the beachball spins. If you
        have ever wondered whether it&apos;s your Mac, your disk, or you - it
        is almost certainly none of those. Finder&apos;s slowness has specific,
        diagnosable causes, and most of them have workarounds. This article
        walks through the real ones, in rough order of how often they bite.
      </p>

      <h2>Finder does far more per file than you think</h2>
      <p>
        When Finder displays a folder, it does not just read the list of names.
        For every visible item it may also:
      </p>
      <ul>
        <li>
          generate or fetch a <strong>thumbnail preview</strong> of the file
          contents (the QuickLook machinery),
        </li>
        <li>
          read <strong>extended metadata</strong> - tags, comments, label
          colors, where the file was downloaded from,
        </li>
        <li>
          resolve the file&apos;s <strong>icon</strong>, which for documents
          means asking Launch Services which app owns it,
        </li>
        <li>
          in list view with &quot;Calculate all sizes&quot; enabled,
          recursively <strong>stat entire subtrees</strong> to show folder
          sizes.
        </li>
      </ul>
      <p>
        Each of these is cheap for one file. Multiplied by thousands of files - 
        and re-done as you scroll - they add up to the lag you feel. The fixes
        below mostly work by turning off work you did not ask for.
      </p>

      <h2>The usual suspects, and their fixes</h2>

      <h3>1. Icon previews and thumbnails</h3>
      <p>
        In icon view, Finder renders a live preview of every image, PDF, and
        video in the folder. In a folder of RAW photos this is brutal. Open{" "}
        <strong>View &gt; Show View Options</strong> (<code>⌘J</code>) and uncheck{" "}
        <strong>Show icon preview</strong> for heavy folders - or browse them
        in list view, which requests far smaller previews.
      </p>

      <h3>2. &quot;Calculate all sizes&quot; in list view</h3>
      <p>
        Innocent-looking checkbox, enormous cost: Finder walks every
        subdirectory of every folder in the listing to display its total size,
        and it re-walks them when things change. Turn it off in{" "}
        <strong>View Options</strong> unless you truly need it, especially on
        slow disks and network volumes.
      </p>

      <h3>3. Network shares and .DS_Store files</h3>
      <p>
        Finder stores each folder&apos;s view settings in a hidden{" "}
        <code>.DS_Store</code> file inside that folder. On an SMB share, every
        directory you open triggers reads and writes of these files over the
        network - and on servers with many small round-trips, that is exactly
        the worst access pattern. You can stop Finder writing them to network
        volumes:
      </p>
      <pre>
        <code>
          defaults write com.apple.desktopservices DSDontWriteNetworkStores
          -bool true
        </code>
      </pre>
      <p>
        Log out and back in (or relaunch Finder) for it to take effect. There
        is a matching <code>DSDontWriteUSBStores</code> key for external
        drives.
      </p>

      <h3>4. Cloud placeholder files</h3>
      <p>
        iCloud Drive, Dropbox, OneDrive, and Google Drive all use{" "}
        <strong>dataless placeholder files</strong>: the file exists in the
        directory listing but its content lives in the cloud until first
        access. Finder has to consult the sync extension for every item&apos;s
        state (downloaded? syncing? cloud-only?), and a misbehaving sync
        client can stall the whole folder view. If one particular synced
        folder is always slow, the fix is usually in the sync app - pause it,
        update it, or mark the folder as always-local.
      </p>

      <h3>5. Spotlight indexing in the background</h3>
      <p>
        After big file operations, OS updates, or restoring from backup,{" "}
        <code>mds_stores</code> can hammer the disk for hours. Check Activity
        Monitor; if Spotlight is the culprit, let it finish overnight, or
        force a clean re-index of a problem volume with{" "}
        <code>sudo mdutil -E /Volumes/Name</code>.
      </p>

      <h3>6. A bloated Launch Services database</h3>
      <p>
        If the delay is specifically the pause before an{" "}
        <strong>Open&nbsp;With</strong> menu appears, or duplicate entries in
        it, the app-to-filetype database has gotten crusty. Rebuilding it is
        safe:
      </p>
      <pre>
        <code>
          /System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister
          -kill -r -domain local -domain system -domain user
        </code>
      </pre>

      <h3>7. When all else fails: relaunch Finder</h3>
      <p>
        Finder is a long-running process that accumulates state. Hold{" "}
        <kbd>⌥</kbd>, right-click the Finder icon in the Dock, and choose{" "}
        <strong>Relaunch</strong>. It takes two seconds and clears a
        surprising number of mystery slowdowns.
      </p>

      <h2>The part you can&apos;t fix with settings</h2>
      <p>
        There is also a structural reason Finder feels the way it does: it is
        a general-purpose consumer application first. It prioritizes rich
        previews, sync integration, and visual polish over raw listing speed,
        and its rendering was never designed around the question{" "}
        <em>
          &quot;what if the user opens a directory with 100,000 entries and
          starts scrolling immediately?&quot;
        </em>{" "}
        No checkbox changes that architecture.
      </p>
      <p>
        That question is answerable, though - it is an engineering problem
        with known solutions: virtualized lists that only render visible rows,
        asynchronous metadata loading that never blocks the UI thread, and
        GPU-accelerated drawing. We wrote about those techniques in{" "}
        <Link href="/blog/what-makes-a-file-manager-fast">
          What makes a file manager fast?
        </Link>
        , and they are exactly how{" "}
        <Link href="/">Shuffle</Link> - a free, open source, GPU-rendered
        Finder alternative - stays instant in directories that make Finder
        wheeze. If you have tuned every setting above and big folders still
        feel heavy, the honest answer may be that you have outgrown Finder,
        not that your Mac is slow.
      </p>

      <div className="callout">
        <p>
          <strong>TL;DR</strong> - turn off icon previews and
          &quot;Calculate all sizes,&quot; stop <code>.DS_Store</code>{" "}
          writes on network shares, check your cloud sync client and
          Spotlight, relaunch Finder - and if that&apos;s still not enough,
          try a file manager built for speed, like{" "}
          <Link href="/">Shuffle</Link> (free, open source).
        </p>
      </div>
    </>
  );
}
