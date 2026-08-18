"use client";

import { Code2, Radio, Wrench } from "lucide-react";
import type { AbiEvent, AbiFunction } from "viem";

import styles from "./Programmable.module.css";
import { Section } from "@/components/ui/Section";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import { TheatrePanel } from "@/components/ui/TheatrePanel";
import { Notice } from "@/components/System/Notice";
import { useHook } from "@/hooks/useHook";
import { signatureOf } from "@/lib/contracts";
import { brand, HOOK_ADDRESS } from "@/config/project";
import { shortAddress } from "@/lib/web3/format";

function SigList({
  items,
  emptyLabel,
}: {
  items: (AbiFunction | AbiEvent)[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className={styles.empty}>{emptyLabel}</p>;
  }
  return (
    <ul className={styles.sigList}>
      {items.map((item) => (
        <li key={signatureOf(item)} className={styles.sig}>
          <span>{signatureOf(item)}</span>
          {"stateMutability" in item && item.stateMutability && (
            <span className={styles.mut}>{item.stateMutability}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * ACT 03 — PROGRAMMABLE BY DESIGN.
 *
 * The one section where the site could most easily lie, so it is the one place
 * that is most tightly constrained: every callback, function and event listed
 * here is read out of `src/lib/contracts/hookAbi.ts`. Nothing is added, nothing
 * is assumed. With no ABI installed, it says so and shows nothing else.
 */
export function Programmable() {
  const hook = useHook();
  const { summary, addressFlags, abiConfigured } = hook;

  return (
    <Section
      id="programmable"
      act="ACT 03"
      eyebrow="The mechanism"
      title="Programmable by Design"
      statement={brand.slogans.programmable}
    >
      <div className={styles.lead}>
        <div className={styles.copy}>
          <p className="prose">
            Uniswap V4 Hooks provide a programmable execution layer around pool
            activity. Where V3 gave every pool the same fixed behaviour, V4 lets a
            pool nominate a contract that the PoolManager calls at defined points
            in its lifecycle.
          </p>
          <p className="prose">
            SHOWTIME uses this programmable layer to implement its fee and token
            mechanics. What that logic does, precisely, is a property of the
            deployed Hook — which is why the panel below reads the contract&apos;s
            own ABI rather than describing behaviour from a brochure.
          </p>
        </div>

        <div className={styles.flowStage}>
          <FlowDiagram
            caption="Swap, hook, custom logic, fee action, final act"
            steps={[
              { label: "Swap" },
              { label: "Hook", accent: true },
              { label: "Custom logic" },
              { label: "Fee action" },
              { label: "Final act" },
            ]}
          />
        </div>
      </div>

      <div className={styles.ledger}>
        {!abiConfigured ? (
          <Notice title="Hook ABI not configured" tone="warn" icon={<Code2 size={16} />}>
            No Hook ABI has been installed, so no callbacks, functions, events or
            permissions can be shown. Paste the deployed artifact into
            <span className="mono"> src/lib/contracts/hookAbi.ts </span> and this
            panel will list exactly what the contract implements — and nothing
            else.
          </Notice>
        ) : (
          <div className={styles.groups}>
            <TheatrePanel ornate>
              <p className={styles.groupTitle}>
                <span>V4 lifecycle callbacks</span>
                <span className={styles.count}>{summary.callbacks.length}</span>
              </p>
              <SigList
                items={summary.callbacks}
                emptyLabel="NO LIFECYCLE CALLBACKS IN ABI"
              />
            </TheatrePanel>

            <TheatrePanel ornate icon={<Wrench size={13} />}>
              <p className={styles.groupTitle}>
                <span>Read functions</span>
                <span className={styles.count}>{summary.reads.length}</span>
              </p>
              <SigList items={summary.reads} emptyLabel="NO READ FUNCTIONS IN ABI" />
            </TheatrePanel>

            <TheatrePanel ornate>
              <p className={styles.groupTitle}>
                <span>Write functions</span>
                <span className={styles.count}>{summary.writes.length}</span>
              </p>
              <SigList items={summary.writes} emptyLabel="NO WRITE FUNCTIONS IN ABI" />
            </TheatrePanel>

            <TheatrePanel ornate icon={<Radio size={13} />}>
              <p className={styles.groupTitle}>
                <span>Events</span>
                <span className={styles.count}>{summary.events.length}</span>
              </p>
              <SigList items={summary.events} emptyLabel="NO EVENTS IN ABI" />
            </TheatrePanel>
          </div>
        )}

        {addressFlags && HOOK_ADDRESS && (
          <TheatrePanel label={`Address permission bits — ${shortAddress(HOOK_ADDRESS, 6)}`}>
            <div className={styles.flags}>
              {addressFlags.map((flag) => (
                <span
                  key={flag.name}
                  className={`${styles.flag} ${flag.enabled ? styles.flagOn : ""}`}
                >
                  <span className={styles.flagDot} aria-hidden="true" />
                  {flag.name}
                </span>
              ))}
            </div>
            <p className={styles.footnote}>
              Uniswap V4 encodes a hook&apos;s permissions in the least significant
              bits of its deployed address. The flags above are decoded from
              NEXT_PUBLIC_HOOK_ADDRESS using the protocol&apos;s own bit layout —
              they describe which callbacks the PoolManager is permitted to
              invoke, not what SHOWTIME&apos;s logic does inside them.
            </p>
          </TheatrePanel>
        )}

        {!HOOK_ADDRESS && (
          <Notice title="Hook unavailable" tone="warn">
            NEXT_PUBLIC_HOOK_ADDRESS is not set, so permission bits cannot be
            decoded and no Hook state can be read.
          </Notice>
        )}
      </div>
    </Section>
  );
}

export default Programmable;
