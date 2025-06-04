/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import type { NextConfig } from "next";
import "./src/env.js";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
  register: true, // Register the service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

/** @type {import("next").NextConfig} */
const config: NextConfig = {
  output: "standalone",
  // Add other Next.js config options here if needed
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withPWA(config as any);
