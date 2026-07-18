"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { DownloadIcon, GitHubIcon } from "./icons";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#showcase", label: "In action" },
  { href: "/#download", label: "Download" },
  { href: "/#open-source", label: "Open source" },
  { href: "/#faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5 ${
          scrolled
            ? "glass shadow-[0_8px_40px_-12px_rgba(37,99,235,0.35)]"
            : "border border-transparent bg-transparent"
        }`}
      >
        <a href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Shuffle"
            width={34}
            height={34}
            className="drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)]"
            priority
          />
          <span className="text-lg font-semibold tracking-tight">Shuffle</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Shuffle on GitHub"
            className="hidden rounded-lg p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white sm:inline-flex"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href="/#download"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-95"
          >
            <DownloadIcon className="h-4 w-4" />
            Download
          </a>
        </div>
      </nav>
    </header>
  );
}
