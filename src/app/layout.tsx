import type { Metadata, Viewport } from "next";

import { fontVariables } from "@/fonts";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/Navigation/Navigation";
import { Footer } from "@/components/Footer/Footer";
import { DemoBanner } from "@/components/System/DemoBanner";
import { NetworkGuard } from "@/components/System/NetworkGuard";
import { StageAtmosphere } from "@/components/CircusStage/StageAtmosphere";

export const metadata: Metadata = {
  metadataBase: new URL("https://showtime.example"),
  title: {
    default: "SHOWTIME",
    template: "%s — SHOWTIME",
  },
  description:
    "SHOWTIME is a programmable Uniswap V4 Hook experiment where every trade becomes part of the show.",
  applicationName: "SHOWTIME",
  keywords: [
    "SHOWTIME",
    "$SHOWTIME",
    "Uniswap V4",
    "Uniswap V4 Hook",
    "Ethereum Mainnet",
    "programmable liquidity",
    "DeFi",
  ],
  openGraph: {
    type: "website",
    title: "SHOWTIME — The Show Never Stops",
    description:
      "SHOWTIME is a programmable Uniswap V4 Hook experiment where every trade becomes part of the show.",
    siteName: "SHOWTIME",
    images: [{ url: "/images/showtime-marquee.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SHOWTIME — The Show Never Stops",
    description:
      "SHOWTIME is a programmable Uniswap V4 Hook experiment where every trade becomes part of the show.",
    images: ["/images/showtime-marquee.webp"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={fontVariables}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <StageAtmosphere />
          <DemoBanner />
          <Navigation />
          <NetworkGuard />
          <main id="top">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
