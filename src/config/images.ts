/**
 * Local image manifest. All artwork ships with the app — no external URLs.
 * Complex artwork is WebP; simple stage furniture (bulbs, borders, curtains,
 * gradients) is drawn with CSS.
 */

export const images = {
  marquee: "/images/showtime-marquee.webp",
  tent: "/images/circus-tent.webp",
  bigTop: "/images/big-top.webp",
  ringmaster: "/images/ringmaster.webp",
  curtain: "/images/red-curtain.webp",
  ticket: "/images/ticket.webp",
  stage: "/images/stage.webp",
  crowd: "/images/crowd.webp",
  poster: "/images/poster-texture.webp",
} as const;

export type ImageKey = keyof typeof images;

export default images;
