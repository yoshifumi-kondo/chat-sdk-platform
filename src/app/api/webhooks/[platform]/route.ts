import { after } from "next/server";
import { bot } from "@/lib/bot";
import { checkRateLimit } from "@/lib/rate-limit";

const VALID_PLATFORMS = ["slack", "discord", "teams", "gchat", "github", "linear"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;

  if (!VALID_PLATFORMS.includes(platform)) {
    return new Response("Unknown platform", { status: 404 });
  }

  // IPベースの簡易レート制限
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = checkRateLimit(`webhook:${ip}`);
  if (!allowed) {
    return new Response("Too Many Requests", { status: 429 });
  }

  const handler = (bot.webhooks as Record<string, typeof bot.webhooks[keyof typeof bot.webhooks]>)[platform];
  if (!handler) {
    return new Response(`Adapter for ${platform} is not configured`, { status: 404 });
  }

  // Vercel/Next.js では request.arrayBuffer() のバイト列がDiscordの署名元と一致しないことがある。
  // request.text() で文字列として読み、新しいRequestを構築して渡すことで回避する。
  let requestForHandler = request;
  if (platform === "discord") {
    const bodyText = await request.text();
    requestForHandler = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: bodyText,
    });
  }

  const response = await handler(requestForHandler, {
    waitUntil: (task: Promise<unknown>) => after(() => task),
  });

  return response;
}
