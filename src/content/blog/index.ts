import type { ComponentType } from "react";

import BestFinderAlternativesMacos from "./best-finder-alternatives-macos";
import WhyIsFinderSlow from "./why-is-finder-slow";
import WhatMakesAFileManagerFast from "./what-makes-a-file-manager-fast";
import HistoryOfTheFileManager from "./history-of-the-file-manager";
import FileManagerArchetypes from "./file-manager-archetypes";
import HowTheDosFatFileSystemWorked from "./how-the-dos-fat-file-system-worked";
import ApfsHowYourMacsFileSystemWorks from "./apfs-how-your-macs-file-system-works";
import HowFuzzySearchWorks from "./how-fuzzy-search-works";
import DualPaneFileManagers from "./dual-pane-file-managers";
import BuildingShuffleRustGpui from "./building-shuffle-rust-gpui";

/** slug → article body component (see src/lib/blog.ts for post metadata). */
export const postComponents: Record<string, ComponentType> = {
  "best-finder-alternatives-macos": BestFinderAlternativesMacos,
  "why-is-finder-slow": WhyIsFinderSlow,
  "what-makes-a-file-manager-fast": WhatMakesAFileManagerFast,
  "history-of-the-file-manager": HistoryOfTheFileManager,
  "file-manager-archetypes": FileManagerArchetypes,
  "how-the-dos-fat-file-system-worked": HowTheDosFatFileSystemWorked,
  "apfs-how-your-macs-file-system-works": ApfsHowYourMacsFileSystemWorks,
  "how-fuzzy-search-works": HowFuzzySearchWorks,
  "dual-pane-file-managers": DualPaneFileManagers,
  "building-shuffle-rust-gpui": BuildingShuffleRustGpui,
};
