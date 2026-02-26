import { Chat, type Adapter } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createDiscordAdapter } from "@chat-adapter/discord";
import { createTeamsAdapter } from "@chat-adapter/teams";
import { createGoogleChatAdapter } from "@chat-adapter/gchat";
import { createGitHubAdapter } from "@chat-adapter/github";
import { createLinearAdapter } from "@chat-adapter/linear";
import { createMemoryState } from "@chat-adapter/state-memory";
import { createServiceClient } from "@/lib/supabase/server";

function buildAdapters() {
  const adapters: Record<string, Adapter> = {};

  if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_SIGNING_SECRET) {
    adapters.slack = createSlackAdapter({
      botToken: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
    });
  }

  if (
    process.env.DISCORD_BOT_TOKEN &&
    process.env.DISCORD_PUBLIC_KEY &&
    process.env.DISCORD_APPLICATION_ID
  ) {
    adapters.discord = createDiscordAdapter({
      botToken: process.env.DISCORD_BOT_TOKEN,
      publicKey: process.env.DISCORD_PUBLIC_KEY,
      applicationId: process.env.DISCORD_APPLICATION_ID,
    });
  }

  if (process.env.TEAMS_APP_ID && process.env.TEAMS_APP_PASSWORD) {
    adapters.teams = createTeamsAdapter({
      appId: process.env.TEAMS_APP_ID,
      appPassword: process.env.TEAMS_APP_PASSWORD,
    });
  }

  if (process.env.GCHAT_CREDENTIALS) {
    adapters.gchat = createGoogleChatAdapter({
      credentials: JSON.parse(process.env.GCHAT_CREDENTIALS),
    });
  }

  if (process.env.GITHUB_WEBHOOK_SECRET) {
    adapters.github = createGitHubAdapter({
      token: process.env.GITHUB_TOKEN,
      webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
    });
  }

  if (process.env.LINEAR_WEBHOOK_SECRET) {
    adapters.linear = createLinearAdapter({
      apiKey: process.env.LINEAR_API_KEY,
      webhookSecret: process.env.LINEAR_WEBHOOK_SECRET,
    });
  }

  return adapters;
}

const bot = new Chat({
  userName: "mention-collector",
  adapters: buildAdapters(),
  state: createMemoryState(),
});

bot.onNewMention(async (thread, message) => {
  const supabase = createServiceClient();

  const { error } = await supabase.from("mentions").insert({
    platform: thread.channel?.id?.split(":")[0] ?? "unknown",
    author_name: message.author.fullName ?? message.author.userName,
    author_id: message.author.userId,
    message_text: message.text,
    thread_id: thread.id,
    channel_name: thread.channelId ?? null,
  });

  if (error) {
    console.error("Failed to save mention:", error);
    await thread.post("Failed to record mention.");
    return;
  }

  await thread.post("Mention recorded!");
});

export { bot };
