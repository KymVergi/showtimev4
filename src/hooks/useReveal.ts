"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight IntersectionObserver hook used to trigger stage lighting cues as
 * sections come into view. Respects prefers-reduced-motion by revealing
 * immediately.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.25,
  once = true,
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, visible };
}

export default useReveal;
