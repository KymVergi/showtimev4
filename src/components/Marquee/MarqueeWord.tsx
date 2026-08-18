import styles from "./MarqueeWord.module.css";

interface MarqueeWordProps {
  text?: string;
  /** `hero` is the giant sign; `compact` is the wordmark used in nav/footer. */
  size?: "hero" | "compact";
  className?: string;
  as?: "h1" | "div" | "span";
}

/**
 * The SHOWTIME sign.
 *
 * Every character becomes a plaque with a face, an extruded body, a raked
 * highlight and two interleaved banks of bulbs. Screen readers get the plain
 * word once; the plaques themselves are decorative.
 */
export function MarqueeWord({
  text = "SHOWTIME",
  size = "hero",
  className,
  as: Tag = "div",
}: MarqueeWordProps) {
  const letters = [...text];

  return (
    <div className={styles.wordWrap}>
      <Tag className={[styles.word, styles[size], className].filter(Boolean).join(" ")}>
        <span className={styles.srOnly}>{text}</span>
        {letters.map((char, index) => (
          <span
            key={`${char}-${index}`}
            className={styles.letter}
            style={{ "--i": index } as React.CSSProperties}
            aria-hidden="true"
          >
            <span className={styles.plaque} />
            <span
              className={`${styles.bulbs} ${styles.bankA} ${
                index === 3 || index === 6 ? styles.flicker : ""
              }`}
            />
            <span className={`${styles.bulbs} ${styles.bankB}`} />
            <span className={`${styles.glyph} ${styles.depth}`}>{char}</span>
            <span className={`${styles.glyph} ${styles.face}`}>{char}</span>
            <span className={`${styles.glyph} ${styles.sheen}`}>{char}</span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

export default MarqueeWord;
