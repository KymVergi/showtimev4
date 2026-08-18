"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCopy(resetMs = 1600) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const el = document.createElement("textarea");
        el.value = value;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        try {
          document.execCommand("copy");
        } finally {
          document.body.removeChild(el);
        }
      }
      setCopied(value);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), resetMs);
    },
    [resetMs],
  );

  return { copy, copied };
}

export default useCopy;
