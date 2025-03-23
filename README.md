# 🐱 Lucky Cat Bot

A fun, fortune-themed Discord bot that lets users test their luck with random rewards, fortune cookies, and adorable themed prizes.

---

## ✨ Features

- `!luck` — Spin to receive prizes, rare items, or a fortune cookie  
- Unique rewards like:
  - 🎁 $100 / $25 Gift Cards (claimed once per server)
  - 🔑 Keys
  - 📈 Level Ups
  - 🥠 Custom Fortune Cookie messages  
- 2 spins per user with a 24-hour cooldown  
- Admin-only reset commands  
- Persistent storage across restarts  
- Fully embedded message system

---

## 🛠️ Built With

- [discord.js](https://discord.js.org/) v14  
- Node.js  
- Simple JSON storage (`usersClaimed.json`)

---

## 📦 Setup

1. **Clone this repo**

   ```bash
   git clone https://github.com/mxisaa/lucky-cat-bot.git
   cd lucky-cat-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add a `.env` file**  
   *(Only if one isn’t already included — check before creating)*

   ```env
   BOT_TOKEN=your_token_here
   ```

4. **Run the bot**

   ```bash
   node luckycat.js
   ```

---

## 🔐 Admin Commands

These are restricted to users with `Administrator` permissions:

- `!resetluck <userID>` — Reset a specific user's spins  
- `!resetgc` — Reset the $100 gift card claim  
- `!reset25gc` — Reset the $25 gift card claim  
- `!resetlunar` — Reset the Lunar New Year Head claim  

---

## 🧠 Notes

- Each user gets **2 total spins**  
- Spins are restricted by a **24-hour cooldown**  
- Claimed rewards and spin tracking are saved in `usersClaimed.json`  
- Fortune cookies rotate randomly from a themed list  

---

## 👤 Author

**Mai**  
GitHub: [@mxisaa](https://github.com/mxisaa)