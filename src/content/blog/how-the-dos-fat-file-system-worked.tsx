import Link from "next/link";
import FatDiskMap from "./interactive/FatDiskMap";

export default function HowTheDosFatFileSystemWorked() {
  return (
    <>
      <p>
        FAT is the file system everyone has used and almost nobody has read
        about. It formatted every DOS floppy and every pre-NT hard disk, and it
        never really went away: the USB stick in your drawer is almost
        certainly FAT32 or exFAT, so is your camera&apos;s SD card, and the EFI
        system partition your Mac or PC boots from is FAT by specification.
        Understanding FAT is also the fastest way to understand file systems in
        general, because it is the simplest design that actually works: a boot
        sector, one table, one directory format, and nothing else. This post
        walks the on-disk structures of FAT12 — the original — and then follows
        the family through FAT16, FAT32, long filenames, and exFAT.
      </p>

      <h2>Born on eight-inch floppies</h2>
      <p>
        The File Allocation Table predates DOS. Marc McDonald, Microsoft&apos;s
        first salaried employee, worked out the scheme with Bill Gates in 1977
        and implemented it for Microsoft&apos;s Standalone Disk BASIC-80, which
        needed some way to keep named files on 8-inch floppies. In 1980 Tim
        Paterson adopted and reworked the idea — with 12-bit table entries —
        for 86-DOS at Seattle Computer Products, and when Microsoft bought
        86-DOS and shipped it as PC&nbsp;DOS 1.0 in 1981, FAT12 became the file
        system of the IBM PC.
      </p>
      <p>
        The design constraints explain everything that follows. A 1981 floppy
        held 160&nbsp;KB; the machine reading it might have 64&nbsp;KB of RAM.
        The file system had to be tiny, had to be traversable with almost no
        memory, and had to tolerate media you could bend. So FAT spends a
        single table on all of its bookkeeping, keeps a second copy of that
        table as its only concession to redundancy, and describes each file
        with one fixed 32-byte record. There are no permissions, no owners,
        and no journal — concepts that would have been meaningless on a
        single-user machine with a beeper for a security system.
      </p>

      <h2>The layout: four regions, in order</h2>
      <p>
        A FAT12 or FAT16 volume is laid out as four consecutive regions. On a
        standard 1.44&nbsp;MB floppy (2,880 sectors of 512 bytes) they look
        like this:
      </p>
      <ol>
        <li>
          <strong>Boot sector</strong> (sector 0). The first bytes are a jump
          instruction and then the <em>BIOS Parameter Block</em> — a little
          table declaring the volume&apos;s geometry: bytes per sector,
          sectors per cluster, number of FATs, root-directory entry count,
          total sectors. Everything else on the disk is found by arithmetic
          from these fields. The sector ends with the boot code and the famous{" "}
          <code>0x55 0xAA</code> signature.
        </li>
        <li>
          <strong>FAT #1</strong> (9 sectors on our floppy) — the allocation
          table itself, described below.
        </li>
        <li>
          <strong>FAT #2</strong> — a byte-for-byte copy of FAT #1, written on
          every update. If a sector of the first table went bad, the data was
          not lost with it. This is the entire crash-resilience story of FAT:
          two copies of one structure, and good luck.
        </li>
        <li>
          <strong>Root directory</strong> — a fixed-size array of 32-byte
          entries; 224 of them (14 sectors) on a 1.44&nbsp;MB floppy. Fixed
          means fixed: a full root directory refused new files even with free
          space remaining. Subdirectories, added in DOS 2.0, are ordinary
          files containing the same 32-byte entries, so only the root had this
          limit.
        </li>
        <li>
          <strong>Data area</strong> — everything remaining, divided into{" "}
          <em>clusters</em> of one or more sectors. Clusters are numbered
          starting at 2 (entries 0 and 1 of the table are reserved), which is
          why the first file on a fresh floppy starts at cluster 2, not 0.
        </li>
      </ol>

      <h2>The 32-byte directory entry</h2>
      <p>
        Every file and subdirectory is described by exactly 32 bytes. The
        layout, unchanged since 1981 (later versions filled in reserved
        bytes), is:
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Offset</th>
              <th>Size</th>
              <th>Field</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0x00</td>
              <td>8</td>
              <td>Name, space-padded, uppercase</td>
            </tr>
            <tr>
              <td>0x08</td>
              <td>3</td>
              <td>Extension — the dot is implied, never stored</td>
            </tr>
            <tr>
              <td>0x0B</td>
              <td>1</td>
              <td>
                Attributes: read-only 0x01, hidden 0x02, system 0x04, volume
                label 0x08, directory 0x10, archive 0x20
              </td>
            </tr>
            <tr>
              <td>0x0C–0x13</td>
              <td>8</td>
              <td>
                Reserved in DOS; later used for creation time and last-access
                date
              </td>
            </tr>
            <tr>
              <td>0x14</td>
              <td>2</td>
              <td>High 16 bits of first cluster (FAT32 only)</td>
            </tr>
            <tr>
              <td>0x16</td>
              <td>4</td>
              <td>Modification time and date, packed 16 bits each</td>
            </tr>
            <tr>
              <td>0x1A</td>
              <td>2</td>
              <td>
                <strong>First cluster</strong> — the head of the file&apos;s
                chain
              </td>
            </tr>
            <tr>
              <td>0x1C</td>
              <td>4</td>
              <td>File size in bytes</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The 8+3 name field is where <code>AUTOEXEC.BAT</code> and{" "}
        <code>README.TXT</code> come from, and why a generation of software
        shipped with names like <code>WP51.EXE</code>. The packed timestamp is
        a small marvel of stinginess: 16 bits for the date (seven bits of year
        counted from 1980, four of month, five of day) and 16 for the time —
        five bits of hours, six of minutes, and five for seconds{" "}
        <em>divided by two</em>. FAT timestamps have two-second resolution
        because there was no room for the odd seconds. And the 32-bit size
        field is the reason a FAT32 stick still refuses any file of
        4&nbsp;GB or larger, in 2026.
      </p>

      <h2>The table itself: a linked list on disk</h2>
      <p>
        Notice what the directory entry does <em>not</em> contain: any list of
        where the file&apos;s data lives, beyond the first cluster. That job
        belongs to the FAT, and its trick is worth savoring. The table has one
        entry per cluster in the data area — entry 7 corresponds to cluster 7
        — and each entry holds simply <strong>the number of the next cluster
        in the file</strong>. The allocation table is a linked list, with the
        pointers stored apart from the data:
      </p>
      <ul>
        <li>
          <code>0x000</code> — cluster is free;
        </li>
        <li>
          any ordinary value — cluster is in use, and here is the next link;
        </li>
        <li>
          <code>0xFF8</code>–<code>0xFFF</code> — end of chain (the file stops
          here);
        </li>
        <li>
          <code>0xFF7</code> — bad cluster, discovered by <code>FORMAT</code>{" "}
          or <code>CHKDSK</code>, never to be allocated.
        </li>
      </ul>
      <p>
        Reading a file is therefore a walk: take the first cluster from the
        directory entry, read it, look up its FAT entry, go where it points,
        repeat until you hit an end-of-chain marker, and trim the final
        cluster with the size field. Free-space accounting needs no separate
        bitmap — count the zeros. Allocation is finding a zero and splicing it
        in. One structure does everything, and on a floppy the whole table
        (4.5&nbsp;KB per copy) fit comfortably in RAM.
      </p>
      <p>Here is the walk, on a miniature volume you can click:</p>
      <FatDiskMap />
      <p>
        The demo&apos;s fragmented <code>GAME.EXE</code> is the design&apos;s
        weakness made visible. Because each link is only found by reading the
        previous one, a badly fragmented file on a real disk meant a seek per
        hop — and the table gives you no way to ask &ldquo;where are all my
        file&apos;s clusters?&rdquo; without walking. Modern file systems
        store <em>extents</em> (start + length runs) precisely to avoid this.
      </p>

      <h2>Deleting a file barely did anything</h2>
      <p>
        When you ran <code>DEL LETTER.TXT</code>, DOS did two cheap things: it
        overwrote the first byte of the directory entry&apos;s name with the
        marker <code>0xE5</code> (&ldquo;this slot is reusable&rdquo;), and it
        walked the FAT chain setting each entry back to zero. That is all. The
        data clusters were not touched, and the rest of the directory entry —
        including the extension, the size, and crucially the{" "}
        <strong>first cluster number</strong> — remained in place.
      </p>
      <p>
        This is why undelete tools were a whole product category, and why
        Norton Utilities made its name. <code>UNERASE</code>, and later
        DOS&nbsp;5&apos;s own <code>UNDELETE</code>, found entries starting
        with <code>0xE5</code>, asked you to supply the lost first letter, and
        then had to reconstruct the chain — which the zeroed FAT no longer
        recorded. The heuristic: assume the file was contiguous, start at the
        surviving first-cluster number, and claim free clusters forward until
        the size field was satisfied. On a lightly used disk, where files
        mostly <em>were</em> contiguous and nothing had overwritten the freed
        clusters, this worked shockingly often. Try it in the demo above:
        delete a file, note that its clusters merely change state, then
        recover it.
      </p>

      <h2>Fragmentation, and the defrag ritual</h2>
      <p>
        DOS allocated new clusters by scanning for the first free entry. On a
        fresh disk that yields tidy contiguous files; after months of
        creating, growing, and deleting, free clusters are scattered and every
        new file is shredded across the platter. The linked-list design means
        fragmentation costs you twice — once in head seeks between data
        clusters, and once because sequential reads become pointer chasing.
        Hence the great shared memory of the era: running{" "}
        <code>DEFRAG</code> (or Norton&apos;s <code>SPEEDISK</code>) and
        watching the little blocks reshuffle for an hour. A defragmenter is
        conceptually simple on FAT — move clusters so each chain is
        consecutive, rewrite the table — which is partly why so many existed.
      </p>

      <h2>FAT12 → FAT16 → FAT32: outgrowing the table, twice</h2>
      <p>
        Every jump in the family was forced by the same arithmetic: cluster
        addresses are fixed-width, so a volume can have only so many clusters,
        so bigger disks force either wider entries or bigger clusters.
      </p>
      <ul>
        <li>
          <strong>FAT12</strong> (1980) — 12-bit entries, at most 4,084
          clusters. Fine for floppies; hopeless for hard disks beyond a few
          dozen megabytes.
        </li>
        <li>
          <strong>FAT16</strong> (PC&nbsp;DOS 3.0, 1984) — 16-bit entries,
          up to 65,524 clusters, arriving with the PC/AT&apos;s hard disk.
          Other 16-bit fields still capped volumes at 32&nbsp;MB until
          Compaq&apos;s DOS 3.31 (1987) widened the sector count, taking
          FAT16 to 2&nbsp;GB — at the cost of 32&nbsp;KB clusters, in which a
          200-byte batch file consumed 32&nbsp;KB of disk. That waste
          (&ldquo;slack space&rdquo;) was the practical scandal of FAT16.
        </li>
        <li>
          <strong>FAT32</strong> (Windows&nbsp;95 OSR2, 1996) — 32-bit
          entries of which 28 bits are used, lifting volumes to 2&nbsp;TB and
          letting clusters shrink back to sane sizes. The root directory also
          finally became an ordinary cluster chain instead of a fixed array.
          The 4&nbsp;GB file-size ceiling, however, is baked into the 32-byte
          directory entry and stayed.
        </li>
      </ul>

      <h2>The long-filename hack, and exFAT</h2>
      <p>
        Windows&nbsp;95 needed <code>Letter to Grandma.doc</code> on a file
        system whose directory entry physically holds eleven characters.
        Microsoft&apos;s solution, <strong>VFAT long filenames</strong>, is a
        beloved dirty trick: store the long name in extra 32-byte directory
        entries placed <em>before</em> the real one, each carrying 13 UTF-16
        characters, a sequence number, and a checksum of the short name. The
        genius is the attribute byte: LFN entries are marked{" "}
        <code>0x0F</code> — read-only + hidden + system + volume-label
        simultaneously — a combination so nonsensical that DOS and every
        existing tool silently ignored the entries instead of choking. Old
        systems saw <code>LETTER~1.DOC</code>; new ones reassembled the long
        name. Full backward and forward compatibility, achieved with a bit
        pattern.
      </p>
      <p>
        <strong>exFAT</strong> (2006, built for flash media and made the
        mandatory format for SDXC cards) is the family&apos;s modernization:
        64-bit file sizes, a real free-space bitmap so allocation no longer
        scans the table, and optional contiguous-file flags that skip chain
        walking entirely. It kept the name and the licensing but is
        structurally a different, simpler-than-NTFS animal. Microsoft
        published the full specification in 2019, and Linux gained a native
        driver soon after.
      </p>

      <h2>What FAT never had</h2>
      <p>
        FAT&apos;s omissions define modern file systems by contrast. No
        ownership or permissions — any process could touch any byte. No
        journaling or copy-on-write: interrupt a write at the wrong moment and
        the two FAT copies could disagree, orphaning chains (<code>CHKDSK</code>
        &apos;s famous <code>FILE0001.CHK</code> files were exactly these
        recovered orphans). No checksums, no snapshots, no hard links, no
        atomic anything. Those are the problems that HFS+, NTFS, ext4, and
        eventually APFS were built to solve — we walk through how your
        Mac&apos;s current file system handles them in{" "}
        <Link href="/blog/apfs-how-your-macs-file-system-works">
          APFS explained
        </Link>
        . And yet: a file manager listing a directory today performs the same
        conceptual acts as DOS did in 1981 — read entries, resolve names, walk
        allocation metadata — just against structures a thousand times more
        elaborate, which is a large part of why doing it fast still takes
        engineering care (that story is in{" "}
        <Link href="/blog/what-makes-a-file-manager-fast">
          What makes a file manager fast?
        </Link>
        , and it is the problem <Link href="/">Shuffle</Link> exists to
        solve). For the fuller arc from CP/M to today, see{" "}
        <Link href="/blog/history-of-the-file-manager">
          our history of the file manager
        </Link>
        .
      </p>
      <p>
        Forty-five years on, FAT survives for the same reason it was invented:
        it is small enough to implement anywhere, simple enough to get right,
        and every device on earth can read it. Not bad for a scheme sketched
        for a BASIC interpreter in 1977.
      </p>

      <div className="callout">
        <p>
          <strong>TL;DR</strong> — a FAT volume is boot sector → two copies of
          the allocation table → root directory → data clusters. Each file is
          one 32-byte entry (8.3 name, attributes, timestamp, size) pointing
          at a first cluster; the FAT itself is a linked list, so reading a
          file means hopping entry to entry until an end-of-chain marker.
          Deletion just wrote <code>0xE5</code> on the name and zeroed the
          chain — data stayed put, which is why undelete worked. FAT12 →
          FAT16 → FAT32 widened cluster addresses as disks grew; VFAT smuggled
          long names past old tools with the impossible attribute{" "}
          <code>0x0F</code>; exFAT carries the family on in your SD cards
          today.
        </p>
      </div>
    </>
  );
}
