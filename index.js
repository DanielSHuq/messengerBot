import "dotenv/config";
import express from "express";
import fs from "fs";
import { selectors, chromium } from "playwright";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import {
  VerifyDiscordRequest,
  getRandomEmoji,
  DiscordRequest,
} from "./utils.js";
import { getShuffledOptions, getResult } from "./game.js";
import {
  Client,
  GatewayIntentBits,
  messageLink,
  Partials,
  Events,
} from "discord.js";
// Create an express app
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", async (message) => {
  const { content } = message;
  if (content.startsWith("message ")) {
    const messageContent = content.slice(8);
    console.log(messageContent);
    console.log(currentPage);
    await currentPage.keyboard.type(messageContent, { delay: 400 });
    await currentPage.keyboard.press("Enter");
  }
});
let currentPage = "";
const app = express();
// Get port, or default to 3000
const PORT = 3000;

const launchBrowser = async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ storageState: "session.json" });
  const page = await context.newPage();
  await page.goto("https://www.messenger.com/");

  const messages = new Promise((resolve, reject) => {
    setTimeout(async () => {
      await page.keyboard.type(process.env.PIN, { delay: 400 });
      resolve("");
    }, 4000);
  });

  messages
    .then(async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      await page.keyboard.press("Escape");
    })
    .then(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await page.keyboard.press("Enter");
    })
    .then(async () => {
      await page.goto("https://www.messenger.com/t/1360693387294687");
      currentPage = page;
      console.log("loading gc");
    });
};
await launchBrowser();

app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
client.login(process.env.DISCORD_TOKEN);
