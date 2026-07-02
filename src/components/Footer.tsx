import Image from "next/image";
import { site } from "@/lib/site";
import { GitHubIcon } from "./icons";

export default function Footer() {
  const year = 2026;
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Shuffle" width={28} height={28} />
          <div>
            <p className="text-sm font-semibold">Shuffle</p>
            <p className="text-xs text-white/40">
              A fast, native file manager for macOS.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-white/55">
          <a href="#features" className="transition-colors hover:text-white">
            Features
          </a>
          <a href="#download" className="transition-colors hover:text-white">
            Download
          </a>
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-5">
        <p className="text-center text-xs text-white/30 sm:text-left">
          © {year} {site.author} · MIT licensed · Made for macOS
        </p>
      </div>
    </footer>
  );
}
