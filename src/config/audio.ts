/**
 * The orchestra pit.
 *
 * Browsers block audio that starts without a user gesture, so the score is
 * never auto-started — it waits for the toggle. Everything tunable lives here.
 */

export const audio = {
  /** Local file only, like the artwork. Drop your track at public/showtime.mp3. */
  src: "/showtime.mp3",

  /** Playback volume once faded in, 0–1. The house plays it low. */
  volume: 0.35,

  /** Fade length in ms — a hard cut sounds like a mistake, a fade sounds staged. */
  fadeMs: 900,

  /** Loop the score so the show never stops. */
  loop: true,

  /** Duck to silence when the tab is hidden, resume when it comes back. */
  pauseWhenHidden: true,

  /**
   * Start the score at the visitor's first click/tap/keypress anywhere on the
   * page, without waiting for them to find the toggle.
   *
   * This is the closest thing to autoplay a browser allows, and it is still
   * polite: it fires once, it never fires for someone who has switched the
   * music off before, and the click on the toggle itself doesn't count (that
   * button handles its own start).
   *
   * Set to false to make the toggle the only way in.
   */
  autoStartOnFirstGesture: true,

  /**
   * localStorage key holding the visitor's choice. Autoplay is still blocked on
   * a fresh page load, so a saved "on" only means "resume at their first
   * interaction" — never "play immediately".
   */
  storageKey: "showtime.orchestra",
} as const;

export default audio;