import { usePathname } from "next/navigation";
import React from "react";

export default function useIsActivePath(currentURL?: string) {
  const pathname = usePathname();
  const isActive =
    pathname?.trim()?.replaceAll("/", "")?.toLowerCase() ===
    currentURL?.trim()?.replaceAll("/", "")?.toLowerCase();

  return { isActive };
}
