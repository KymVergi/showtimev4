import styles from "./TicketStream.module.css";

interface TicketStreamProps {
  count?: number;
  compact?: boolean;
  className?: string;
}

/**
 * Every trade is a ticket — so tickets are always in the air, drifting toward
 * the Big Top. Deterministic pseudo-random placement keeps SSR and the client
 * in agreement (no `Math.random()` during render).
 */
export function TicketStream({
  count = 14,
  compact = false,
  className,
}: TicketStreamProps) {
  const stubs = Array.from({ length: count }, (_, i) => {
    // Cheap deterministic scatter — stable across server and client renders.
    const seed = (i * 9301 + 49297) % 233280;
    const rand = seed / 233280;
    return {
      x: `${Math.round(((i * 7.3 + rand * 24) % 96) + 2)}%`,
      drift: `${Math.round((rand - 0.5) * 160)}px`,
      dur: `${(16 + rand * 14).toFixed(1)}s`,
      delay: `${(-rand * 22).toFixed(1)}s`,
    };
  });

  return (
    <div
      className={[styles.field, compact ? styles.compact : "", className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      {stubs.map((stub, i) => (
        <span
          key={i}
          className={styles.stub}
          style={
            {
              "--x": stub.x,
              "--drift": stub.drift,
              "--dur": stub.dur,
              "--delay": stub.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default TicketStream;
