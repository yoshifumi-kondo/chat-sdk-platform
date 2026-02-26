import { verifyKey } from "discord-interactions";

export async function POST(request: Request) {
  const signature = request.headers.get("x-signature-ed25519") ?? "";
  const timestamp = request.headers.get("x-signature-timestamp") ?? "";
  const body = await request.text();
  const publicKey = process.env.DISCORD_PUBLIC_KEY ?? "";

  console.log("[discord-test] verification attempt", {
    signatureLength: signature.length,
    timestampLength: timestamp.length,
    bodyLength: body.length,
    publicKeyLength: publicKey.length,
    publicKeyPrefix: publicKey.slice(0, 8),
    publicKeySuffix: publicKey.slice(-8),
    bodyPreview: body.slice(0, 100),
  });

  const isValid = await verifyKey(body, signature, timestamp, publicKey);

  console.log("[discord-test] verification result:", isValid);

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  const interaction = JSON.parse(body);

  // PING → PONG
  if (interaction.type === 1) {
    console.log("[discord-test] PING received, responding with PONG");
    return new Response(JSON.stringify({ type: 1 }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ type: 1 }), {
    headers: { "Content-Type": "application/json" },
  });
}
