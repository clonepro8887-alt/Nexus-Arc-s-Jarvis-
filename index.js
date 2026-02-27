const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

/* ================= WEB PARA RENDER ================= */
app.listen(PORT, "0.0.0.0", () => {
  console.log("🌐 Web activa en puerto " + PORT);
});

app.get("/", (req, res) => {
  res.send("🔥 Nexus Bot activo");
});

/* ================= DISCORD BOT ================= */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`🔥 Bot listo como ${client.user.tag}`);
});

/* ================= IDs DE ROLES ================= */
// Phases 1-5
const PHASE_ROLES = {
  "1": "1476743660484956204",
  "2": "1476743716667527291",
  "3": "1476743749542609048",
  "4": "1476743770304155811",
  "5": "1476743788973260954",
  "app": "1476743732584775722"
};

// Subniveles
const LEVEL_ROLES = {
  "low": "1476744695282532485",
  "weak": "1476744710793068706",
  "mid": "1476744806897287239",
  "stable": "1476744819043860591",
  "high": "1476744734830498065",
  "strong": "1476744781253185688"
};

// Canal general
const GENERAL_CHANNEL_ID = "1458311760233889973";

/* ================= EVENTO MENSAJES ================= */
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  /* ===== AUTO CHAT SOLO EN GENERAL ===== */
  if (message.channel.id === GENERAL_CHANNEL_ID) {
    const msg = message.content.toLowerCase();

    if (msg.includes("hola")) {
      message.reply("🔥 Hola, soy el bot oficial de Nexus");
    }

    if (msg.includes("nexus")) {
      message.reply("⚔️ Nexus domina el servidor");
    }

    if (msg.includes("bot")) {
      message.reply("🤖 Estoy activo 24/7");
    }
  }

  /* ===== COMANDO .PHASE ===== */
  if (!message.content.startsWith(".phase")) return;

  if (!message.member.permissions.has("Administrator")) {
    return message.reply("❌ No tienes permiso para usar este comando.");
  }

  const args = message.content.trim().split(/\s+/);
  const target = message.mentions.members.first();
  const phase = args[2]?.toLowerCase();
  const level1 = args[3]?.toLowerCase();
  const level2 = args[4]?.toLowerCase();

  if (!target) return message.reply("❌ Menciona un usuario.");
  if (!PHASE_ROLES[phase]) return message.reply("❌ Fase inválida (1-5 o app).");

  try {
    // 🔄 Quitar todas las fases
    for (let key in PHASE_ROLES) {
      const roleId = PHASE_ROLES[key];
      if (target.roles.cache.has(roleId)) {
        await target.roles.remove(roleId);
      }
    }

    // 🔄 Quitar todos los subniveles
    for (let key in LEVEL_ROLES) {
      const roleId = LEVEL_ROLES[key];
      if (target.roles.cache.has(roleId)) {
        await target.roles.remove(roleId);
      }
    }

    // ➕ Añadir nueva fase
    await target.roles.add(PHASE_ROLES[phase]);

    // ➕ Añadir subniveles si existen
    if (LEVEL_ROLES[level1]) await target.roles.add(LEVEL_ROLES[level1]);
    if (LEVEL_ROLES[level2]) await target.roles.add(LEVEL_ROLES[level2]);

    message.reply(`✅ ${target.user.username} ahora es Phase ${phase} ${level1 || ""} ${level2 || ""}`);
  } catch (err) {
    console.error(err);
    message.reply("❌ Error al asignar roles.");
  }
});

client.login(process.env.TOKEN);
