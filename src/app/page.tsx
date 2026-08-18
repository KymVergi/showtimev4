import { Hero } from "@/components/Hero/Hero";
import { Show } from "@/components/Show/Show";
import { Ringmaster } from "@/components/Ringmaster/Ringmaster";
import { Programmable } from "@/components/Programmable/Programmable";
import { BigTop } from "@/components/BigTop/BigTop";
import { WhyAHook } from "@/components/HookExplainer/WhyAHook";
import { Revenue } from "@/components/Revenue/Revenue";
import { FinalAct } from "@/components/FinalAct/FinalAct";
import { CurtainAct } from "@/components/Curtain/CurtainAct";
import { Tokenomics } from "@/components/Tokenomics/Tokenomics";
import { LiveShow } from "@/components/LiveShow/LiveShow";
import { WalletTicket } from "@/components/Wallet/WalletTicket";
import { Contract } from "@/components/Contract/Contract";

/**
 * The running order.
 *
 * Trade → ticket → revenue → hook → programmable logic → buyback → burn →
 * the curtain opens again.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Show />
      <Ringmaster />
      <Programmable />
      <BigTop />
      <WhyAHook />
      <Revenue />
      <FinalAct />
      <CurtainAct />
      <Tokenomics />
      <LiveShow />
      <WalletTicket />
      <Contract />
    </>
  );
}
