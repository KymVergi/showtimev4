import type { Metadata } from "next";
import Link from "next/link";

import styles from "./status.module.css";
import { TicketButton } from "@/components/ui/TicketButton";
import { Curtains } from "@/components/Curtain/Curtains";

export const metadata: Metadata = {
  title: "No such performance",
};

export default function NotFound() {
  return (
    <div className={styles.stage}>
      <Curtains state="ajar" pelmet />
      <div className={styles.panel}>
        <span className={styles.code}>404 — NO SUCH PERFORMANCE</span>
        <h1 className={styles.title}>That ticket isn&apos;t for tonight</h1>
        <p className={styles.body}>
          There is nothing playing at this address. The main show is still on.
        </p>
        <div className={styles.actions}>
          <TicketButton href="/">Enter the show</TicketButton>
          <Link href="/docs" className={styles.quiet}>
            Read the programme
          </Link>
        </div>
      </div>
    </div>
  );
}
