import { FileText } from "lucide-react";

import styles from "./Hero.module.css";
import { MarqueeWord } from "@/components/Marquee/MarqueeWord";
import { Curtains } from "@/components/Curtain/Curtains";
import { BigTopBackdrop } from "@/components/CircusStage/BigTopBackdrop";
import { TicketStream } from "@/components/Show/TicketStream";
import { ConnectButton } from "@/components/Wallet/ConnectButton";
import { TicketButton } from "@/components/ui/TicketButton";
import { brand, CHAIN_NAME } from "@/config/project";

const RIBBON = [
  brand.slogans.ticket,
  brand.slogans.hook,
  brand.slogans.programmable,
  brand.slogans.bigTop,
];

/**
 * The moment the doors open: drapes ajar, the Big Top behind, tickets in the
 * air, and the sign lit. Everything else on the page is smaller than this.
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="showtime-sign">
      <BigTopBackdrop />
      <TicketStream count={16} />
      <Curtains state="ajar" />
      <div className={styles.floor} aria-hidden="true" />

      <div className={styles.content}>
        <span className={styles.label}>{brand.primarySlogan}</span>

        <div className={styles.sign} id="showtime-sign">
          <MarqueeWord as="h1" size="hero" />
        </div>

        <p className={styles.subtitle}>{brand.subtitle}</p>

        <span className={styles.network}>
          <span className={styles.networkDot} aria-hidden="true" />
          {CHAIN_NAME}
        </span>

        <div className={styles.ctas}>
          <ConnectButton label="Enter the show" size="default" />
          <TicketButton
            variant="secondary"
            href="#the-contract"
            icon={<FileText size={15} />}
          >
            View contract
          </TicketButton>
        </div>
      </div>

      <a className={styles.cue} href="#the-show" aria-label="Continue to the show">
        <span className={styles.cueLine} aria-hidden="true" />
        The show
      </a>

      <div className={styles.ribbon} aria-hidden="true">
        <div className={styles.ribbonTrack}>
          {[...RIBBON, ...RIBBON, ...RIBBON, ...RIBBON].map((line, i) => (
            <span key={i} className={styles.ribbonItem}>
              {line}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
