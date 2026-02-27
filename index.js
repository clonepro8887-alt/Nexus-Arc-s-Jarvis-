// ================= IMPORTS =================
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");

// ================= WEB PARA RAILWAY =================
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Nexus Bot activo 24/7 en Railway");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Web activa en puerto ${PORT}`);
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

const GENERAL_CHANNEL_ID = "1458311760233889973";

// ================= READY =================
client.once("clientReady", () => {
  console.log(`Bot listo como ${client.user.tag}`);
});

// ================= MESSAGE EVENT =================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // ===== AUTO CHAT =====
  if (message.channel.id === GENERAL_CHANNEL_ID) {
    const rand = Math.random();

    if (rand < 0.10) {
      const frases = [
        "Weee eso ta medio raro",
        "Ta fuerte lo que dices",
        "No manches",
        "Jajaja qué fue eso",
        "Ta pesado eso",
        "XD qué fue"
      ];
      const random = frases[Math.floor(Math.random() * frases.length)];
      message.channel.send(random);
    }

    else if (rand < 0.20 && message.mentions.members.size > 0) {
      const burlas = [
        "Mira quién habla",
        "Qué pasó ahora",
        "Eso lo dice él",
        "Interesante viniendo de"
      ];
      const target = message.mentions.members.first();
      const random = burlas[Math.floor(Math.random() * burlas.length)];
      message.channel.send(`${random} ${target.user.username}`);
    }
  }

  // ===== COMANDO .PHASE =====
  if (!message.content.startsWith(".phase")) return;

  if (!message.member.permissions.has("Administrator")) {
    return message.reply({ content: "No tienes permiso.", allowedMentions: { repliedUser: false } });
  }

  const args = message.content.trim().split(/\s+/);
  const target = message.mentions.members.first();
  const phase = args[2]?.toLowerCase();
  const level1 = args[3]?.toLowerCase();
  const level2 = args[4]?.toLowerCase();

  if (!target) return message.reply("Menciona un usuario.");
  if (!PHASE_ROLES[phase]) return message.reply("Fase inválida (0-5 o app).");

  try {
    const botHighest = message.guild.members.me.roles.highest.position;

    // Quitar fases
    for (let key in PHASE_ROLES) {
      const role = message.guild.roles.cache.get(PHASE_ROLES[key]);
      if (role && target.roles.cache.has(role.id) && role.position < botHighest) {
        await target.roles.remove(role);
      }
    }

    // Quitar niveles
    for (let key in LEVEL_ROLES) {
      const role = message.guild.roles.cache.get(LEVEL_ROLES[key]);
      if (role && target.roles.cache.has(role.id) && role.position < botHighest) {
        await target.roles.remove(role);
      }
    }

    // Añadir fase
    const phaseRole = message.guild.roles.cache.get(PHASE_ROLES[phase]);
    if (phaseRole && phaseRole.position < botHighest) {
      await target.roles.add(phaseRole);
    }

    // Añadir niveles
    if (LEVEL_ROLES[level1]) {
      const role = message.guild.roles.cache.get(LEVEL_ROLES[level1]);
      if (role && role.position < botHighest) {
        await target.roles.add(role);
      }
    }

    if (LEVEL_ROLES[level2]) {
      const role = message.guild.roles.cache.get(LEVEL_ROLES[level2]);
      if (role && role.position < botHighest) {
        await target.roles.add(role);
      }
    }

    // ===== EMBED ÉXITO =====
    const successEmbed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({ name: "NEXUS SYSTEM" })
      .setTitle("PHASE UPDATE")
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setDescription("━━━━━━━━━━━━━━━━━━")
      .addFields(
        { name: "User", value: `${target}`, inline: false },
        { name: "Phase", value: `> ${phase}`, inline: true },
        { name: "Sub Tier 1", value: `> ${level1 || "None"}`, inline: true },
        { name: "Sub Tier 2", value: `> ${level2 || "None"}`, inline: true },
        { name: "Assigned by", value: `<@${message.author.id}>`, inline: false }
      )
      .setFooter({ text: "Nexus Authority • System Registered" })
      .setTimestamp();

    message.channel.send({ embeds: [successEmbed] });

  } catch (err) {
    console.error(err);

    const errorEmbed = new EmbedBuilder()
      .setColor("#8b0000")
      .setAuthor({ name: "NEXUS SYSTEM" })
      .setTitle("PHASE UPDATE FAILED")
      .setDescription("━━━━━━━━━━━━━━━━━━")
      .addFields(
        { name: "Status", value: "Role assignment failed.", inline: false },
        { name: "Reason", value: "Check bot role hierarchy and permissions.", inline: false },
        { name: "Requested by", value: `<@${message.author.id}>`, inline: false }
      )
      .setFooter({ text: "Nexus Authority • Error Log" })
      .setTimestamp();

    message.channel.send({ embeds: [errorEmbed] });
  }
});

// ================= LOGIN =================
client.login(process.env.TOKEN);
