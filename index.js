// ================= IMPORTS =================
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

// ================= WEB PARA RAILWAY =================
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🔥 Nexus Bot activo 24/7 en Railway");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Web activa en puerto ${PORT}`);
});

// ================= DISCORD BOT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ================= ROLES =================
const PHASE_ROLES = {
  "1": "1476743660484956204",
  "2": "1476743716667527291",
  "3": "1476743749542609048",
  "4": "1476743770304155811",
  "5": "1476743788973260954",
  "app": "1476743732584775722"
};

const LEVEL_ROLES = {
  "low": "1476744695282532485",
  "weak": "1476744710793068706",
  "mid": "1476744806897287239",
  "stable": "1476744819043860591",
  "high": "1476744734830498065",
  "strong": "1476744781253185688"
};

// ID de canal #general donde funciona auto chat
const GENERAL_CHANNEL_ID = "1458311760233889973";

// ================= EVENTO READY =================
client.once("ready", () => {
  console.log(`🔥 Bot listo como ${client.user.tag}`);
});

// ================= EVENTO MESSAGE =================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // ===== AUTO CHAT SOLO EN GENERAL =====
  if (message.channel.id === GENERAL_CHANNEL_ID && Math.random() < 0.40) {
    const respuestas = [
      "Y que we 😂",
      "Hablen bien ps",
      "Ta fuerte eso 👀",
      "XD",
      "Eso sonó personal 😭",
      "Estoy leyendo todo 👁️"
    ];
    const random = respuestas[Math.floor(Math.random() * respuestas.length)];
    message.channel.send(random);
  }

  // ===== COMANDO .PHASE =====
  if (!message.content.startsWith(".phase")) return;

  // Solo admins o usuarios con Manage Roles
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
    // ===== DEPURACIÓN =====
    console.log("Target:", target.user.tag);
    console.log("Phase a añadir:", PHASE_ROLES[phase]);
    console.log("Level1:", LEVEL_ROLES[level1], "Level2:", LEVEL_ROLES[level2]);

    // 🔄 Quitar todas las fases
    for (let key in PHASE_ROLES) {
      const roleId = PHASE_ROLES[key];
      if (target.roles.cache.has(roleId)) await target.roles.remove(roleId);
    }

    // 🔄 Quitar todos los niveles
    for (let key in LEVEL_ROLES) {
      const roleId = LEVEL_ROLES[key];
      if (target.roles.cache.has(roleId)) await target.roles.remove(roleId);
    }

    // ➕ Añadir nueva fase
    await target.roles.add(PHASE_ROLES[phase]);

    // ➕ Añadir subniveles si existen
    if (LEVEL_ROLES[level1]) await target.roles.add(LEVEL_ROLES[level1]);
    if (LEVEL_ROLES[level2]) await target.roles.add(LEVEL_ROLES[level2]);

    message.reply(`✅ ${target.user.username} ahora es Phase ${phase} ${level1 || ""} ${level2 || ""}`);
  } catch (err) {
    console.error("Error asignando roles:", err);
    message.reply("❌ Error al asignar roles. Revisa jerarquía y permisos del bot.");
  }
});

// ================= LOGIN =================
client.login(process.env.TOKEN);
