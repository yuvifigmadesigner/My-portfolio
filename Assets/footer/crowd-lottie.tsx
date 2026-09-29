"use client";

/**
 * CrowdLottie
 * Plays the baked crowd animation (public/crowd/crowd.json, a Lottie file) inside the pink
 * footer card.
 *
 * - Uses lottie-web's light canvas player (no expressions, about 45 KB gzipped). It loads only
 *   when the card gets near the screen, and the JSON is fetched from /public, not bundled.
 * - Fills the card and trims the sides (xMidYMid slice), so one file fits the 300px web card
 *   and the 342px mobile card.
 * - Pauses when the card is off screen or the tab is hidden. With reduced motion it shows one
 *   still frame.
 *
 * Setup: `pnpm add lottie-web`, put crowd.json in public/crowd/, then inside the card
 * (the card needs `relative overflow-hidden`):  <CrowdLottie />
 */

import { useEffect, useRef } from "react";
import type { AnimationItem, CanvasRendererConfig } from "lottie-web";

export function CrowdLottie({
  src = "/crowd/crowd.json",
  className,
}: {
  src?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    let anim: AnimationItem | undefined;
    let near = false;
    let cancelled = false;
    const still =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sync = () => {
      if (!anim) return;
      if (near && !still && !document.hidden) anim.play();
      else anim.pause();
    };

    const load = async () => {
      const { default: lottie } = await import("lottie-web/build/player/lottie_light_canvas");
      if (cancelled) return;
      // dpr is supported by the canvas player but missing from lottie-web's types
      const settings: CanvasRendererConfig & { dpr: number } = {
        preserveAspectRatio: "xMidYMid slice",
        clearCanvas: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      };
      anim = lottie.loadAnimation({
        container: box,
        renderer: "canvas",
        loop: true,
        autoplay: false,
        path: src,
        rendererSettings: settings,
      });
      anim.addEventListener("DOMLoaded", () => {
        anim?.goToAndStop(0, true);
        sync();
      });
    };

    // start loading a little before the card scrolls into view
    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near && !anim) void load();
        sync();
      },
      { rootMargin: "300px" },
    );
    io.observe(box);

    const ro = new ResizeObserver(() => anim?.resize());
    ro.observe(box);
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelled = true;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      anim?.destroy();
    };
  }, [src]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}

export default CrowdLottie;
