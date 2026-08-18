"use client";

import { Tooltip } from "@mui/material";

import styles from "./Orchestra.module.css";
import { useOrchestra } from "./OrchestraProvider";

interface OrchestraToggleProps {
  /** Hide the "ORCHESTRA" word and render a square plate. */
  iconOnly?: boolean;
  className?: string;
}

/**
 * The house control for the score.
 *
 * Renders nothing until mounted (so server and client markup agree) and nothing
 * at all if the audio file failed to load — a button that can never work is
 * worse than no button.
 */
export function OrchestraToggle({ iconOnly = false, className }: OrchestraToggleProps) {
  const { ready, playing, failed, toggle } = useOrchestra();

  if (!ready || failed) return null;

  return (
    <Tooltip title={playing ? "SILENCE THE ORCHESTRA" : "CUE THE ORCHESTRA"} arrow>
      <button
        type="button"
        // Marks this subtree so the page-wide "start on first click" cue skips
        // it — the button starts and stops the score through `toggle` alone.
        data-orchestra-toggle=""
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Stop the music" : "Play the music"}
        className={[
          styles.toggle,
          playing ? styles.on : styles.off,
          iconOnly ? styles.iconOnly : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className={styles.bars} aria-hidden="true">
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </span>
        <span className={styles.label}>Orchestra</span>
        <span className={styles.pip} aria-hidden="true" />
      </button>
    </Tooltip>
  );
}

export default OrchestraToggle;