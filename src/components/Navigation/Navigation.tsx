"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Drawer } from "@mui/material";
import { Menu, X } from "lucide-react";

import styles from "./Navigation.module.css";
import { MarqueeWord } from "@/components/Marquee/MarqueeWord";
import { ConnectButton } from "@/components/Wallet/ConnectButton";
import { OrchestraToggle } from "@/components/Audio/OrchestraToggle";
import { CHAIN_NAME, socials } from "@/config/project";

const LINKS = [
  { label: "The Show", href: "/#the-show" },
  { label: "The Hook", href: "/#the-ringmaster" },
  { label: "Tokenomics", href: "/#tokenomics" },
  { label: "The Big Top", href: "/#the-big-top" },
  { label: "Docs", href: socials.docs },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.bar} aria-label="Primary">
        <Link href="/" className={styles.brand} aria-label="SHOWTIME — home">
          <MarqueeWord size="compact" as="span" />
        </Link>

        <div className={styles.links}>
          {LINKS.map((link) => (
            <Link key={link.label} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.right}>
          <span className={styles.network} title="SHOWTIME runs on Ethereum Mainnet only">
            <span className={styles.networkDot} aria-hidden="true" />
            {CHAIN_NAME}
          </span>

          <OrchestraToggle iconOnly className={styles.orchestraSlot} />

          <span className={styles.connectSlot}>
            <ConnectButton label="Connect" />
          </span>

          <button
            type="button"
            className={styles.burger}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className={styles.drawer}>
          <div className={styles.drawerHead}>
            <MarqueeWord size="compact" as="span" />
            <button
              type="button"
              className={styles.drawerClose}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={styles.drawerLink}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className={styles.drawerFoot}>
            <OrchestraToggle />
            <span className={styles.network}>
              <span className={styles.networkDot} aria-hidden="true" />
              {CHAIN_NAME}
            </span>
            <ConnectButton label="Enter the show" size="default" block />
          </div>
        </div>
      </Drawer>
    </header>
  );
}

export default Navigation;