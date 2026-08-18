"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { audio as config } from "@/config/audio";

interface OrchestraValue {
  /** True once the component has mounted on the client. */
  ready: boolean;
  playing: boolean;
  /** The browser refused to start playback (usually: no user gesture yet). */
  blocked: boolean;
  /** The file is missing or undecodable — the toggle hides itself. */
  failed: boolean;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

const OrchestraContext = createContext<OrchestraValue | null>(null);

/** Read the toggle state from anywhere: `const { playing, toggle } = useOrchestra()`. */
export function useOrchestra(): OrchestraValue {
  const ctx = useContext(OrchestraContext);
  if (!ctx) {
    throw new Error("useOrchestra must be used inside <OrchestraProvider>");
  }
  return ctx;
}

type Preference = "on" | "off" | null;

/** `null` means the visitor has never expressed a choice. */
function readPreference(): Preference {
  try {
    const raw = window.localStorage.getItem(config.storageKey);
    return raw === "on" || raw === "off" ? raw : null;
  } catch {
    return null;
  }
}

function writePreference(on: boolean) {
  try {
    window.localStorage.setItem(config.storageKey, on ? "on" : "off");
  } catch {
    // Private mode, blocked storage — the toggle still works for this visit.
  }
}

/**
 * Owns the single <audio> element for the whole site and exposes play/stop.
 *
 * Deliberate choices:
 * - Never calls play() outside a user gesture (or the first gesture after a
 *   saved "on"), so the browser never has to reject us in front of the visitor.
 * - Fades volume in and out rather than cutting, because a hard cut on a
 *   looping score sounds broken.
 * - Pauses when the tab is hidden so the music doesn't play into an empty room.
 */
export function OrchestraProvider({ children }: { children: ReactNode }) {
  const elementRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  /** Remembers intent across a visibility-driven pause. */
  const wantsSoundRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => setReady(true), []);

  const cancelFade = useCallback(() => {
    if (fadeRef.current !== null) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  /** Ramps volume to `to` over fadeMs, then runs `done`. */
  const fadeTo = useCallback(
    (to: number, done?: () => void) => {
      const el = elementRef.current;
      if (!el) return;
      cancelFade();

      const from = el.volume;
      const started = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - started) / config.fadeMs);
        // easeOutQuad — most of the movement happens early, so the fade reads
        // as intentional rather than sluggish.
        const eased = 1 - (1 - t) * (1 - t);
        el.volume = Math.max(0, Math.min(1, from + (to - from) * eased));
        if (t < 1) {
          fadeRef.current = requestAnimationFrame(step);
        } else {
          fadeRef.current = null;
          done?.();
        }
      };

      fadeRef.current = requestAnimationFrame(step);
    },
    [cancelFade],
  );

  const start = useCallback(() => {
    const el = elementRef.current;
    if (!el || failed) return;

    wantsSoundRef.current = true;
    cancelFade();
    el.volume = 0;

    const attempt = el.play();
    if (attempt === undefined) {
      // Very old browsers return nothing from play().
      setPlaying(true);
      setBlocked(false);
      writePreference(true);
      fadeTo(config.volume);
      return;
    }

    attempt
      .then(() => {
        setPlaying(true);
        setBlocked(false);
        writePreference(true);
        fadeTo(config.volume);
      })
      .catch(() => {
        // Almost always "no user gesture yet". Stay quiet and wait.
        setPlaying(false);
        setBlocked(true);
      });
  }, [cancelFade, fadeTo, failed]);

  const stop = useCallback(() => {
    const el = elementRef.current;
    wantsSoundRef.current = false;
    writePreference(false);
    setPlaying(false);
    if (!el) return;
    fadeTo(0, () => el.pause());
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playing) stop();
    else start();
  }, [playing, start, stop]);

  /**
   * The house cue: the score starts at the visitor's first interaction with the
   * page — a click anywhere, a tap, a key. This is as close to autoplay as a
   * browser permits, and it fires exactly once.
   *
   * Two things it deliberately will not do:
   *  - fire for someone who has switched the music off before (a saved "off" is
   *    a decision, and re-starting it every visit would be rude);
   *  - fire on the toggle itself, which starts the score through its own
   *    handler — without this guard the pointerdown would start playback and
   *    the click would then be read as "stop".
   */
  useEffect(() => {
    const preference = readPreference();
    if (preference === "off") return;
    if (preference === null && !config.autoStartOnFirstGesture) return;

    const cue = (event: Event) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-orchestra-toggle]") !== null
      ) {
        return; // let the button speak for itself
      }

      start();
      window.removeEventListener("pointerdown", cue);
      window.removeEventListener("keydown", cue);
    };

    window.addEventListener("pointerdown", cue);
    window.addEventListener("keydown", cue);

    return () => {
      window.removeEventListener("pointerdown", cue);
      window.removeEventListener("keydown", cue);
    };
  }, [start]);

  /** Don't play to an empty house. */
  useEffect(() => {
    if (!config.pauseWhenHidden) return;

    const onVisibility = () => {
      const el = elementRef.current;
      if (!el) return;
      if (document.hidden) {
        if (!el.paused) {
          cancelFade();
          el.pause();
          setPlaying(false);
        }
      } else if (wantsSoundRef.current) {
        void el.play().then(() => {
          setPlaying(true);
          fadeTo(config.volume);
        }).catch(() => setPlaying(false));
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [cancelFade, fadeTo]);

  useEffect(() => cancelFade, [cancelFade]);

  const value = useMemo<OrchestraValue>(
    () => ({ ready, playing, blocked, failed, start, stop, toggle }),
    [ready, playing, blocked, failed, start, stop, toggle],
  );

  return (
    <OrchestraContext.Provider value={value}>
      {children}
      <audio
        ref={elementRef}
        src={config.src}
        loop={config.loop}
        preload="none"
        // No `controls` — the house has its own toggle.
        onEnded={() => !config.loop && setPlaying(false)}
        onError={() => {
          // Missing or undecodable file: hide the control rather than offer a
          // button that can never work.
          setFailed(true);
          setPlaying(false);
        }}
        aria-hidden="true"
      />
    </OrchestraContext.Provider>
  );
}

export default OrchestraProvider;