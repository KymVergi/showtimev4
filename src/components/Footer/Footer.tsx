import Link from "next/link";

import styles from "./Footer.module.css";
import { MarqueeWord } from "@/components/Marquee/MarqueeWord";
import {
  brand,
  CHAIN_NAME,
  HOOK_ADDRESS,
  socials,
  TOKEN_ADDRESS,
  explorerAddress,
} from "@/config/project";
import { shortAddress } from "@/lib/web3/format";

export function Footer() {
  const year = new Date().getFullYear();

  const external = [
    socials.x ? { label: "X", href: socials.x } : null,
    socials.github ? { label: "GitHub", href: socials.github } : null,
    socials.telegram ? { label: "Telegram", href: socials.telegram } : null,
    socials.uniswap ? { label: "Uniswap Pool", href: socials.uniswap } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className={styles.footer}>
      <div className={styles.velvet} aria-hidden="true" />
      <div className={styles.fringe} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <MarqueeWord size="compact" as="span" />
          <p className={styles.slogan}>{brand.primarySlogan}</p>
          <span className={styles.network}>
            <span className={styles.dot} aria-hidden="true" />
            {CHAIN_NAME}
          </span>
        </div>

        <div>
          <p className={styles.colTitle}>The Contract</p>
          <ul className={styles.list}>
            <li>
              <span className={styles.muted}>{brand.ticker} TOKEN</span>
              <br />
              {TOKEN_ADDRESS ? (
                <a
                  className={styles.addr}
                  href={explorerAddress(TOKEN_ADDRESS)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortAddress(TOKEN_ADDRESS, 8)}
                </a>
              ) : (
                <span className={styles.muted}>NOT CONFIGURED</span>
              )}
            </li>
            <li>
              <span className={styles.muted}>SHOWTIME HOOK</span>
              <br />
              {HOOK_ADDRESS ? (
                <a
                  className={styles.addr}
                  href={explorerAddress(HOOK_ADDRESS)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortAddress(HOOK_ADDRESS, 8)}
                </a>
              ) : (
                <span className={styles.muted}>NOT CONFIGURED</span>
              )}
            </li>
          </ul>
        </div>

        <div>
          <p className={styles.colTitle}>Front of House</p>
          <ul className={styles.list}>
            <li>
              <Link className={styles.listLink} href={socials.docs}>
                Docs
              </Link>
            </li>
            <li>
              <Link className={styles.listLink} href="/holders">
                Holders
              </Link>
            </li>
            <li>
              <Link className={styles.listLink} href="/#the-contract">
                Contract
              </Link>
            </li>
            {external.map((item) => (
              <li key={item.label}>
                <a
                  className={styles.listLink}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label} ↗
                </a>
              </li>
            ))}
            {external.length === 0 && (
              <li className={styles.muted}>SOCIAL LINKS NOT CONFIGURED</li>
            )}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {year} SHOWTIME</span>
        <span>{brand.subtitle}</span>
        <span>{brand.slogans.curtain}</span>
      </div>
    </footer>
  );
}

export default Footer;
