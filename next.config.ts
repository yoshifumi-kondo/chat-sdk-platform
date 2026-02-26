import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "zlib-sync",
    "discord.js",
    "@discordjs/ws",
    "@discordjs/rest",
  ],
};

export default nextConfig;
