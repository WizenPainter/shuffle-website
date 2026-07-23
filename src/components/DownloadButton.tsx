"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { AppleIcon, DownloadIcon } from "./icons";

type Props = {
  label?: string;
  className?: string;
  showVersion?: boolean;
};

type Release = {
  tag_name?: string;
  assets?: { name: string; browser_download_url: string }[];
};

/**
 * Download button that always points at the latest GitHub release.
 *
 * The default href is GitHub's stable `/releases/latest/download/<name>`
 * redirect, so it works with zero JavaScript. On mount it also queries the
 * GitHub API to (a) show the current version and (b) resolve the exact asset
 * URL even if the DMG is named per-version (e.g. Shuffle-0.1.0.dmg). If the API
 * is unavailable it silently falls back to the stable link.
 */
export default function DownloadButton({
  label = "Download for macOS",
  className = "",
  showVersion = true,
}: Props) {
  const [href, setHref] = useState(site.dmgUrl);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(site.releasesApiUrl, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Release | null) => {
        if (!data) return;
        if (data.tag_name) setVersion(data.tag_name.replace(/^v/i, ""));
        const dmg = data.assets?.find((a) => a.name.toLowerCase().endsWith(".dmg"));
        if (dmg) setHref(dmg.browser_download_url);
      })
      .catch(() => {
        /* offline / rate-limited / no release yet - keep the stable link */
      });
    return () => controller.abort();
  }, []);

  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-95 ${className}`}
    >
      <AppleIcon className="h-5 w-5" />
      {label}
      {showVersion && version && (
        <span className="rounded-md bg-ink/10 px-1.5 py-0.5 text-xs font-medium text-ink/70">
          v{version}
        </span>
      )}
      <DownloadIcon className="h-4 w-4 opacity-60 transition-transform group-hover:translate-y-0.5" />
    </a>
  );
}
