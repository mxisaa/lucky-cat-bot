const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');

// Persistent storage
const DATA_FILE = './usersClaimed.json';
let userData = {};
let $100GiftCardClaimed = false;
let $25GiftCardClaimed = false;
let lunarHeadClaimed = false;

// Bot init
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Handle messages
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();
  const userId = message.author.id;

  if (content === '!luck') return handleLuck(message, userId);
  if (content.startsWith('!resetluck')) return handleResetUser(message);
  if (content === '!resetgc') return handleResetReward(message, '$100');
  if (content === '!reset25gc') return handleResetReward(message, '$25');
  if (content === '!resetlunar') return handleResetReward(message, 'lunar');
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  loadPersistentData();
});

// ========== Logic ==========

async function handleLuck(message, userId) {
  const now = Date.now();
  if (!userData[userId]) userData[userId] = { spins: 0, lastSpin: 0 };
  const user = userData[userId];

  if (user.spins >= 2) {
    return replyEmbed(message, "No More Spins!", "You’ve used both spins. Better luck next time!", "Red", "https://i.ibb.co/kSH2JHN/remove.png");
  }

  if (now - user.lastSpin < 24 * 60 * 60 * 1000) {
    const timeLeft = formatTime(24 * 60 * 60 * 1000 - (now - user.lastSpin));
    return replyEmbed(message, "On Cooldown!", `You can spin again in **${timeLeft}**.`, "Orange", "https://i.ibb.co/tpMf3Wp/hourglass.png");
  }

  user.spins += 1;
  user.lastSpin = now;
  savePersistentData();

  const { reward, isBigReward } = getRandomReward();
  const thumb = reward.includes("Fortune") ? "https://i.ibb.co/yNw1hFr/fortune-cookie.png"
                : isBigReward ? "https://i.ibb.co/tbm2vqj/trophy.png"
                : "https://i.ibb.co/27v282h/confetti.png";

  replyEmbed(message, "Your Luck!", `🎉 ${message.author}, you received: **${reward}**`, isBigReward ? "Gold" : "#FFA500", thumb);
}

function handleResetUser(message) {
  const args = message.content.split(' ');
  const userId = args[1];
  if (!userId) return message.reply('Provide a user ID.');

  if (userData[userId]) {
    userData[userId] = { spins: 0, lastSpin: 0 };
    savePersistentData();
    return message.reply(`Reset spins for user: ${userId}`);
  }

  return message.reply("User not found.");
}

function handleResetReward(message, type) {
  if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return message.reply("You don’t have permission to do that.");
  }

  switch (type) {
    case '$100':
      $100GiftCardClaimed = false;
      break;
    case '$25':
      $25GiftCardClaimed = false;
      break;
    case 'lunar':
      lunarHeadClaimed = false;
      break;
  }

  savePersistentData();
  return message.reply(`${type === 'lunar' ? 'Lunar Head' : type + ' Gift Card'} has been reset.`);
}

// ========== Rewards ==========

function getRandomReward() {
  const random = Math.random();

  if (!$100GiftCardClaimed && random < 0.04) {
    $100GiftCardClaimed = true;
    savePersistentData();
    return { reward: "$100 Skyblock Gift Card", isBigReward: true };
  }

  if (!$25GiftCardClaimed && random < 0.10) {
    $25GiftCardClaimed = true;
    savePersistentData();
    return { reward: "$25 Skyblock Gift Card", isBigReward: true };
  }

  if (!lunarHeadClaimed && random < 0.15) {
    lunarHeadClaimed = true;
    savePersistentData();
    return { reward: "🎭 Lunar New Year Head with Special Lore", isBigReward: true };
  }

  if (random < 0.22) return { reward: "🔑 Legendary Key", isBigReward: false };
  if (random < 0.32) return { reward: "🔑 Epic Key", isBigReward: false };
  if (random < 0.42) return { reward: "📈 1 Level Up", isBigReward: false };

  const fortune = fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)];
  return { reward: `🥠 Fortune Cookie: "${fortune}"`, isBigReward: false };
}

const fortuneCookies = [
  "Luck is on your side today!",
  "Your kindness will bring unexpected rewards.",
  "An exciting opportunity is just around the corner.",
  "Happiness is yours to take!",
  "A cheerful heart will bring you good fortune.",
  "Prepare for a joyful surprise.",
  "Your patience will be rewarded.",
  "A new adventure awaits soon.",
  "Abundance is coming.",
  "Share your blessings, they multiply."
];

// ========== Helpers ==========

function formatTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

function replyEmbed(message, title, desc, color, thumbnail) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(desc)
    .setColor(color)
    .setThumbnail(thumbnail)
    .setImage("https://i.ibb.co/cxbzsR8/l1-3.png")
    .setFooter({ text: "- The Skyblock Discord Team" });

  safeReply(message, { embeds: [embed] });
}

async function safeReply(message, options) {
  try {
    await message.reply(options);
  } catch (err) {
    console.error("Reply error:", err);
  }
}

// ========== Persistence ==========

function loadPersistentData() {
  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    userData = data.userData || {};
    $100GiftCardClaimed = data.$100GiftCardClaimed || false;
    $25GiftCardClaimed = data.$25GiftCardClaimed || false;
    lunarHeadClaimed = data.lunarHeadClaimed || false;
  }
}

function savePersistentData() {
  const data = {
    userData,
    $100GiftCardClaimed,
    $25GiftCardClaimed,
    lunarHeadClaimed
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ========== Error Handling + Startup ==========

process.on('uncaughtException', (error) => {
  console.error("Uncaught Exception:", error);
  restartBot();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  restartBot();
});

function restartBot() {
  console.log("Restarting bot...");
  try {
    savePersistentData();
  } catch (err) {
    console.error("Save error:", err);
  }
  client.destroy();
  setTimeout(() => process.exit(1), 1000);
}

// Start bot
client.login(process.env.BOT_TOKEN || '');