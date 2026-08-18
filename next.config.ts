import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // All artwork ships with the app under public/images — nothing is fetched
  // from a third-party host at runtime.
  images: {
    remotePatterns: [],
    formats: ["image/webp"],
  },

  // No secrets exist server-side (everything the browser needs is
  // NEXT_PUBLIC_), so the only header worth setting here is the referrer
  // policy and the usual hardening trio.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
