"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

type Props = {
  html: string;
  className?: string;
};

/**
 * Renders legacy landing HTML but intercepts same-origin navigations so Next.js
 * can client-transition instead of full document reloads.
 */
export default function LandingHtmlWithClientNav({ html, className }: Props) {
  const router = useRouter();

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const hrefAttr = anchor.getAttribute("href")?.trim() ?? "";
      if (!hrefAttr || hrefAttr.startsWith("javascript:")) return;

      if (hrefAttr.startsWith("mailto:") || hrefAttr.startsWith("tel:")) return;
      if (anchor.getAttribute("target") === "_blank") return;
      if (anchor.hasAttribute("download")) return;

      // Let the browser handle in-page anchors (no pathname change).
      if (hrefAttr.startsWith("#") && !hrefAttr.slice(1).includes("/")) return;

      let url: URL;
      try {
        url = new URL(hrefAttr, window.location.origin);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      e.preventDefault();
      router.push(`${url.pathname}${url.search}${url.hash}`);
    },
    [router],
  );

  return (
    <div
      className={className}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
