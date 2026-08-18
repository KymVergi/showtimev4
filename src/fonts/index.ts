import localFont from "next/font/local";

/**
 * Fonts are self-hosted, not fetched from Google.
 *
 * These are the same families the brand calls for — Cinzel for the marquee and
 * headings, Playfair Display for the italic statements, Inter for UI, JetBrains
 * Mono for addresses and hashes — shipped as variable WOFF2 files inside the
 * repo. That keeps builds working offline, avoids a third-party request on
 * every page view, and eliminates the FOUT you get from a remote stylesheet.
 *
 * All four are licensed under the SIL Open Font License 1.1 — see
 * `src/fonts/README.md` for upstream sources and licence links.
 */

export const cinzel = localFont({
  src: "./cinzel-latin-wght-normal.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--font-cinzel",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  preload: true,
});

export const playfair = localFont({
  src: [
    { path: "./playfair-display-latin-wght-normal.woff2", weight: "400 900", style: "normal" },
    { path: "./playfair-display-latin-wght-italic.woff2", weight: "400 900", style: "italic" },
  ],
  variable: "--font-playfair",
  display: "swap",
  fallback: ["Georgia", "serif"],
  preload: true,
});

export const inter = localFont({
  src: "./inter-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  preload: true,
});

export const jetbrainsMono = localFont({
  src: "./jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  style: "normal",
  variable: "--font-mono-jb",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  preload: true,
});

export const fontVariables = [
  cinzel.variable,
  playfair.variable,
  inter.variable,
  jetbrainsMono.variable,
].join(" ");
