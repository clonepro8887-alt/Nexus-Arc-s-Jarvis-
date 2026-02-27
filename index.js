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
  "0": "1458682851414380605",
  "1": "1458680324799201280",
  "2": "1473427053561905363",
  "3": "1458680188937175296",
  "4": "1458679781536043060",
  "5": "1458678850060947719",
  "app": "1473427053561905363"
};

const LEVEL_ROLES = {
  "low": "1458679384691970186",
  "mid": "1458679896837586976",
  "high": "1458680037912875151",
  "weak": "1458679584429178921",
  "stable": "1458679985668755466",
  "strong": "1458680108066930731"
};

// ID de canal #general donde funciona auto chat
const GENERAL_CHANNEL_ID = "1458311760233889973";

// ================= EVENTO READY =================
client.once("clientReady", () => {
  console.log(`🔥 Bot listo como ${client.user.tag}`);
});

// ================= EVENTO MESSAGE =================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // ===== AUTO CHAT SOLO EN GENERAL =====
  if (message.channel.id === GENERAL_CHANNEL_ID) {
    const rand = Math.random();

    // 10% chance: respuesta normal
    if (rand < 0.10) {
      const burlasLatam = [
        "Weeee, eso ta medio jato 😂",
        "Ta bravo el we 😎",
        "No manches, weee 😭",
        "Jajaja qué haces güey XD",
        "Ta pesado eso, boludo 👀",
        "Weee, eso suena duro 😂",
        "XD qué weeee",
        "Ja ja ja, te leyeron we",
        "Ta todo cagado 😂"
      ];
      const random = burlasLatam[Math.floor(Math.random() * burlasLatam.length)];
      message.channel.send(random);
    }

    // 10% chance: burlita picante a alguien mencionado
    else if (rand < 0.20 && message.mentions.members.size > 0) {
      const burlasFuerte = [
        "Jajaja pobre",
        "Weee mirá quién habla 😏",
        "XD qué le pasó ahora a",
        "Ta cagado weee"
      ];
      const target = message.mentions.members.first();
      const random = burlasFuerte[Math.floor(Math.random() * burlasFuerte.length)];
      message.channel.send(`${random} ${target.user.username} 😂`);
    }

    // 80% chance: no dice nada
  }

  // ===== COMANDO .PHASE =====
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
  if (!PHASE_ROLES[phase]) return message.reply("❌ Fase inválida (0-5 o app).");

  try {
    // 🔄 Quitar todas las fases que el bot pueda quitar
    for (let key in PHASE_ROLES) {
      const roleId = PHASE_ROLES[key];
      if (target.roles.cache.has(roleId) && message.guild.roles.cache.has(roleId)) {
        const role = message.guild.roles.cache.get(roleId);
        if (role.position < message.guild.me.roles.highest.position) {
          await target.roles.remove(role);
        }
      }
    }

    // 🔄 Quitar todos los niveles que el bot pueda quitar
    for (let key in LEVEL_ROLES) {
      const roleId = LEVEL_ROLES[key];
      if (target.roles.cache.has(roleId) && message.guild.roles.cache.has(roleId)) {
        const role = message.guild.roles.cache.get(roleId);
        if (role.position < message.guild.me.roles.highest.position) {
          await target.roles.remove(role);
        }
      }
    }

    // ➕ Añadir nueva fase si el bot puede
    const phaseRole = message.guild.roles.cache.get(PHASE_ROLES[phase]);
    if (phaseRole && phaseRole.position < message.guild.me.roles.highest.position) {
      await target.roles.add(phaseRole);
    }

    // ➕ Añadir subniveles si existen y el bot puede
    if (LEVEL_ROLES[level1]) {
      const role = message.guild.roles.cache.get(LEVEL_ROLES[level1]);
      if (role && role.position < message.guild.me.roles.highest.position) {
        await target.roles.add(role);
      }
    }
    if (LEVEL_ROLES[level2]) {
      const role = message.guild.roles.cache.get(LEVEL_ROLES[level2]);
      if (role && role.position < message.guild.me.roles.highest.position) {
        await target.roles.add(role);
      }
    }

    message.reply(`✅ ${target.user.username} ahora es Phase ${phase} ${level1 || ""} ${level2 || ""}`);
  } catch (err) {
    console.error("Error asignando roles:", err);
    message.reply("❌ Error al asignar roles. Revisa jerarquía y permisos del bot.");
  }
});

// ================= LOGIN =================
client.login(process.env.TOKEN);
