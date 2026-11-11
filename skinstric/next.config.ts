import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server work through GitHub Codespaces addresses.
  allowedDevOrigins: ["127.0.0.1", "*.app.github.dev"],
};

export default nextConfig;
