"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

import styles from "./CurtainAct.module.css";
import { Curtains, type CurtainState } from "./Curtains";
import { useReveal } from "@/hooks/useReveal";
import { brand } from "@/config/project";

type Beat = "idle" | "closing" | "question" | "opening" | "answer" | "coda";

/**
 * ACT 07 — THE CURTAIN.
 *
 * The one beat on the page that is pure theatre. Scroll it into view and the
 * drapes come in, the house asks "SHOW OVER?", then the curtain flies and the
 * answer lands: NEVER.
 *
 * The sequence runs on timers rather than chained CSS so the beats can be
 * retimed in one place, and it can be replayed on demand.
 */
export function CurtainAct() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.45, true);
  const [beat, setBeat] = useState<Beat>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const run = useCallback(() => {
    clear();
    setBeat("closing");
    const at = (ms: number, next: Beat) =>
      timers.current.push(setTimeout(() => setBeat(next), ms));

    at(1500, "question");
    at(3400, "opening");
    at(4300, "answer");
    at(5600, "coda");
  }, [clear]);

  // Start the sequence the first time the stage is in view. The cleanup only
  // runs on unmount, so it never cancels the timers it just scheduled.
  const started = useRef(false);
  useEffect(() => {
    if (visible && !started.current) {
      started.current = true;
      run();
    }
  }, [visible, run]);

  useEffect(() => clear, [clear]);

  const curtainState: CurtainState =
    beat === "closing" || beat === "question" ? "closed" : beat === "idle" ? "ajar" : "open";

  const showQuestion = beat === "question";
  const showAnswer = beat === "answer" || beat === "coda";
  const showCoda = beat === "coda";

  return (
    <section id="the-curtain" className={styles.section} aria-labelledby="curtain-title">
      <div className={styles.head}>
        <span className="eyebrow">Act 07</span>
        <h2 className="sectionTitle" id="curtain-title">
          The Curtain
        </h2>
      </div>

      <div ref={ref} className={styles.stage}>
        <Curtains state={curtainState} pelmet />
        <span className={styles.frame} aria-hidden="true" />

        <div className={styles.words}>
          <p
            className={`${styles.line} ${styles.question} ${
              showQuestion ? styles.visible : ""
            }`}
          >
            SHOW OVER?
          </p>

          <p
            className={`${styles.line} ${styles.answer} ${showAnswer ? styles.visible : ""}`}
          >
            NEVER.
          </p>

          <p className={`${styles.line} ${styles.coda} ${showCoda ? styles.visible : ""}`}>
            {brand.primarySlogan}
          </p>
        </div>

        <button type="button" className={styles.replay} onClick={run}>
          <RotateCcw size={12} />
          Replay
        </button>
      </div>
    </section>
  );
}

export default CurtainAct;
