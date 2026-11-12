import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server work through GitHub Codespaces addresses.
  allowedDevOrigins: ["127.0.0.1", "*.app.github.dev"],
  // Old addresses forward to the new ones.
  async redirects() {
    return [
      { source: "/intro", destination: "/testing", permanent: false },
      { source: "/scan", destination: "/result", permanent: false },
      { source: "/results", destination: "/summary", permanent: false },
    ];
  },
};

export default nextConfig;
