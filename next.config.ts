import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "zlib-sync",
    "discord.js",
    "discord-interactions",
    "@discordjs/ws",
    "@discordjs/rest",
    "@chat-adapter/discord",
  ],
};

export default nextConfig;
