import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // lets you open the dev site from your phone on the same Wi-Fi
  allowedDevOrigins: ["192.168.1.5"],
  // stops Next picking up a stray package-lock.json higher up the folder tree
  turbopack: { root: here },
};

export default nextConfig;
