import Link from "next/link";

export default function ApfsHowYourMacsFileSystemWorks() {
  return (
    <>
      <p>
        In September 2017, macOS High Sierra did something operating systems
        almost never do: during a routine point-ish upgrade, it converted the
        startup disk of every Mac with flash storage to a brand-new file
        system, in place, keeping all the data. Apple File System — APFS — had
        already run the same maneuver on hundreds of millions of iPhones with
        iOS 10.3 that March, and the fact that you probably don&apos;t
        remember either event is the highest compliment a file-system
        migration can receive. This post explains what APFS actually does
        under the hood, why it replaced HFS+, and which of its design choices
        you bump into every day without knowing it.
      </p>

      <h2>Why replace HFS+ at all?</h2>
      <p>
        HFS+ shipped with Mac&nbsp;OS&nbsp;8.1 in January 1998, and it was
        itself an extension of 1985&apos;s HFS. It was designed for spinning
        disks, single users, and a world where a big drive held a few
        gigabytes. By the 2010s Apple was strapping it onto SSDs, encrypting
        it by wrapping a whole volume manager (Core Storage) around it,
        bolting on journaling, and living with one-second timestamps and a
        volume-wide catalog file that serialized metadata updates behind a
        single lock. Every modern feature was an add-on fighting a 1998
        architecture. APFS, announced at WWDC 2016 and developed in roughly
        two years, restarted from the assumptions that actually hold today:
        storage is flash, encryption is mandatory, devices crash mid-write,
        and copying data that already exists on disk is a waste of everyone&apos;s
        time.
      </p>
      <p>
        The in-place conversion deserves a sentence of awe. The migrator
        walked the HFS+ volume and wrote all the new APFS metadata into the
        volume&apos;s <em>free space</em>, leaving every block of file data
        exactly where it lay; only when the new structures were complete and
        verified did it flip the switch. Data was never copied and the old
        file system remained bootable until the final commit. Apple dry-ran
        the logic on customer iPhones during earlier iOS updates — converting,
        verifying, then discarding the result — before ever doing it for
        real.
      </p>

      <h2>Copy-on-write: never overwrite anything</h2>
      <p>
        The foundational idea in APFS is that metadata is{" "}
        <strong>never modified in place</strong>. When a directory B-tree node
        changes, APFS writes the updated node to a fresh location, then
        updates the parent to point at it — freshly written as well — and so
        on up to the top. At the very top sits a checkpoint: the last atomic
        pointer flip that makes the whole new tree &ldquo;current.&rdquo;
        Until that flip, the previous consistent state is untouched; after
        it, the new one is. A crash at any instant leaves you with a valid
        tree — either the old one or the new one, never a half-written
        hybrid.
      </p>
      <p>
        Compare the alternatives. Old FAT volumes simply corrupted (we walked
        through that machinery in{" "}
        <Link href="/blog/how-the-dos-fat-file-system-worked">
          how the DOS FAT file system worked
        </Link>
        ). HFS+ and NTFS added a <em>journal</em>: write your intentions to a
        log first, then do the risky in-place update, and replay the log
        after a crash — every metadata change written twice. Copy-on-write
        gets crash consistency without the journal and without the double
        write, and it happens to suit flash memory, which prefers writing to
        fresh pages anyway. It also makes the next three features nearly
        free.
      </p>

      <p>
        A word on what those trees actually are, because the vocabulary
        recurs. Everything in APFS is an <em>object</em> — a block, or run of
        blocks, with a header carrying a checksum, an ID, and a transaction
        number. File and directory records live in B-trees, one file-system
        tree per volume (where HFS+ had a single catalog file for the whole
        disk, a genuine bottleneck under parallel load). Objects refer to one
        another through an <em>object map</em> that translates a virtual
        object ID plus a transaction ID into a physical location — the
        indirection that lets a snapshot say &ldquo;give me every object as
        of transaction 4,180&rdquo; and get a consistent historical view of
        the volume without storing anything extra.
      </p>

      <h2>Clones: why &ldquo;Duplicate&rdquo; is instant</h2>
      <p>
        Select a 30&nbsp;GB video in any file manager and duplicate it. On
        APFS the copy completes in a few milliseconds and consumes no
        additional space. What happened: APFS created a new file — new inode,
        new name — whose extent records point at the{" "}
        <strong>same physical blocks</strong> as the original. Nothing was
        read, nothing was copied. Only when you later edit one of the two
        files does copy-on-write kick in: the modified blocks are written to
        new locations for that file, while unmodified blocks remain shared.
        Storage cost grows with the <em>divergence</em> between the copies,
        not their size.
      </p>
      <p>
        This is exposed to every application through the{" "}
        <code>clonefile()</code> system call, and Finder&apos;s Duplicate,{" "}
        <code>cp -c</code>, and any decent{" "}
        <Link href="/">file manager</Link> use it automatically. It is also
        why the &ldquo;copying&rdquo; progress bar behaves so differently
        depending on destination — more on that below.
      </p>

      <h2>Snapshots: the whole volume, frozen for free</h2>
      <p>
        Extend cloning from one file to an entire volume and you get{" "}
        <strong>snapshots</strong>: a read-only reference to the volume&apos;s
        complete state at an instant, created in constant time by simply
        keeping a pointer to the current tree instead of letting it be
        garbage-collected. Blocks referenced by a snapshot are not freed when
        files are later deleted; like clones, a snapshot&apos;s cost is the
        divergence since it was taken.
      </p>
      <p>
        macOS leans on this constantly. Time Machine takes hourly{" "}
        <em>local snapshots</em> so it can back up a consistent frozen image
        (and restore files even with the backup disk unplugged). Software
        updates snapshot the system volume before touching it, which is what
        makes a failed update recoverable. Since Big Sur, your Mac actually{" "}
        <em>boots from</em> a cryptographically sealed snapshot of the system
        volume — the running OS is a snapshot, verified against an Apple
        signature.
      </p>

      <h2>Space sharing: partitions without the partitioning</h2>
      <p>
        APFS inserts a layer between the disk and the file systems on it: the{" "}
        <strong>container</strong>. A container owns the physical space; the
        volumes inside it are purely logical and all draw from the same free
        pool. There is no &ldquo;resize partition&rdquo; step, ever — a
        volume is as big as its files, and free space belongs to everyone.
      </p>
      <p>
        Your Mac uses this aggressively. What looks like one disk is a
        container holding a read-only, sealed <strong>System</strong> volume,
        your <strong>Data</strong> volume (linked into one visible tree by
        firmlinks), plus Preboot, Recovery, and VM volumes — five file
        systems sharing one pool of free space with no fixed sizes. Adding a
        volume for a beta OS takes a second and steals no space up front.
      </p>

      <h2>Encryption, sparse files, and fast sizing</h2>
      <p>
        Encryption in APFS is native, not layered underneath like Core
        Storage FileVault was. A volume can be unencrypted, encrypted with a
        single key, or — as on iOS and Macs with the T2/Apple&nbsp;silicon
        Secure Enclave — <strong>multi-key</strong>: each file gets its own
        encryption key, wrapped by class keys, with a separate key protecting
        sensitive metadata. Per-file keys are what allow features like
        &ldquo;this file is inaccessible until first unlock&rdquo; and
        instant secure erase (destroy the keys, not the data).
      </p>
      <p>
        Two smaller conveniences round it out. <strong>Sparse files</strong>{" "}
        allocate space only for ranges actually written — a 100&nbsp;GB
        virtual-machine disk image that contains 12&nbsp;GB of data occupies
        12&nbsp;GB (HFS+ allocated the full amount). And APFS can maintain{" "}
        <strong>running size totals for directories</strong> (fast directory
        sizing), so asking &ldquo;how big is this folder?&rdquo; doesn&apos;t
        have to mean statting a hundred thousand descendants — one of several
        traversal costs that make folder listings slower than they should be,
        a topic we dissected in{" "}
        <Link href="/blog/why-is-finder-slow">Why is Finder so slow?</Link>
      </p>

      <h2>The parts you notice without knowing why</h2>
      <ul>
        <li>
          <strong>&ldquo;Free space&rdquo; is a negotiation.</strong> Snapshots
          retain deleted data, and macOS counts space it <em>could</em> free
          (old snapshots, caches — &ldquo;purgeable&rdquo; space) as
          available. So Finder, <code>df</code>, and Disk Utility can all
          report different numbers, and deleting 50&nbsp;GB of files may free
          almost nothing until the snapshots referencing them expire —
          usually within 24 hours.
        </li>
        <li>
          <strong>Copies are instant only within a volume.</strong> A clone is
          shared blocks inside one file system; copy to another volume — even
          in the same container — or to an external disk, and every byte must
          physically move again.
        </li>
        <li>
          <strong>Deleting doesn&apos;t always free.</strong> If Time Machine
          snapshotted the file an hour ago, the blocks stay until the
          snapshot goes. <code>tmutil listlocalsnapshots /</code> shows the
          culprits.
        </li>
        <li>
          <strong>Duplicates that cost nothing… until they don&apos;t.</strong>{" "}
          Clone a project folder, edit heavily in one copy, and disk usage
          climbs by the changed blocks even though &ldquo;Get Info&rdquo;
          reports both folders at full size. Sizes in APFS are logical;
          shared and sparse blocks make the sum of file sizes routinely
          exceed the disk.
        </li>
        <li>
          <strong>Erasing is instantaneous.</strong> Because encrypted
          volumes are unreadable without their keys, &ldquo;Erase All Content
          and Settings&rdquo; just destroys the keys — no multi-hour
          overwrite pass required.
        </li>
      </ul>

      <h2>What APFS doesn&apos;t do</h2>
      <p>
        The most-cited criticism: APFS checksums its <em>metadata</em>{" "}
        (Fletcher checksums on every object) but <strong>not your file
        data</strong>. ZFS and btrfs checksum everything and can detect —
        and, with redundancy, repair — silent bit rot; APFS trusts the strong
        error correction inside Apple&apos;s flash controllers instead.
        That&apos;s a defensible bet on Apple hardware and a real gap on
        third-party disks. Second, copy-on-write plus hard-drive physics is
        an unhappy marriage: metadata scattered across a spinning platter
        means seeks, and APFS on HDDs (and Fusion Drives) is measurably
        slower than HFS+ was — Apple ships a defragmenter for the case, but
        flash is clearly the assumed substrate. Compression exists only as
        the inherited transparent-compression scheme from HFS+ days, not a
        first-class per-volume option, and there is nothing like ZFS&apos;s
        RAID integration.
      </p>
      <p>
        One early stumble is worth recording. The first iOS releases of APFS
        treated filenames as raw byte strings without Unicode normalization,
        so <code>café</code> saved by one app (é as a single code point) and{" "}
        <code>café</code> saved by another (e plus combining accent) could be
        two different files that displayed identically — breaking real apps
        in 2017. Apple fixed it within months: APFS is now
        normalization-insensitive but normalization-preserving, and, on
        macOS, case-insensitive by default just as HFS+ was. The episode is a
        nice reminder that filenames are one of the hardest easy-looking
        problems in systems software.
      </p>

      <h2>HFS+ vs APFS at a glance</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>HFS+ (1998)</th>
              <th>APFS (2017)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Designed for</td>
              <td>Spinning disks</td>
              <td>Flash / SSD</td>
            </tr>
            <tr>
              <td>Crash safety</td>
              <td>Journaling (added 2002)</td>
              <td>Copy-on-write + checkpoints</td>
            </tr>
            <tr>
              <td>File clones</td>
              <td>No — full copy</td>
              <td>Instant, space-shared</td>
            </tr>
            <tr>
              <td>Snapshots</td>
              <td>No</td>
              <td>Native, constant-time</td>
            </tr>
            <tr>
              <td>Volume layout</td>
              <td>Fixed partitions</td>
              <td>Container with space sharing</td>
            </tr>
            <tr>
              <td>Encryption</td>
              <td>Core Storage layer below FS</td>
              <td>Native, multi-key, per-file</td>
            </tr>
            <tr>
              <td>Timestamps</td>
              <td>1 second</td>
              <td>1 nanosecond</td>
            </tr>
            <tr>
              <td>Sparse files</td>
              <td>No</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Data checksums</td>
              <td>None</td>
              <td>Metadata only</td>
            </tr>
            <tr>
              <td>Concurrency</td>
              <td>Volume-wide catalog lock</td>
              <td>Per-volume trees, finer-grained</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The through-line of APFS is a single trick applied everywhere: never
        overwrite, just point somewhere new. Out of that one decision fall
        crash safety, free duplicates, snapshots, and sealed system volumes.
        It is not the most featureful file system in the world — ZFS keeps
        that crown — but it may be the most successfully deployed redesign in
        file-system history: one billion devices converted in place, and
        nobody noticed.
      </p>

      <div className="callout">
        <p>
          <strong>TL;DR</strong> — APFS replaced 1998-vintage HFS+ in 2017 by
          converting devices in place. It never overwrites metadata
          (copy-on-write + checkpoints = crash safety without a journal),
          which makes duplicates instant shared-block clones and whole-volume
          snapshots free — that&apos;s how Time Machine local snapshots and
          macOS update rollback work, and why free-space numbers look weird.
          One container lets System, Data, and friends share space with no
          partitioning; encryption is native with per-file keys. Main gaps:
          no checksums on file data (metadata only) and mediocre
          spinning-disk performance.
        </p>
      </div>
    </>
  );
}
