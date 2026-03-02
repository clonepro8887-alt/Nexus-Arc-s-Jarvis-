import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

// ============================
// DISCORD CLIENT
// ============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ============================
// EXPRESS (UPTIME RAILWAY)
// ============================
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Nexus Bot activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor web activo en puerto ${PORT}`);
});

// ============================
// BLOQUEO 1 DÍA POR USUARIO
// ============================
const phaseCooldown = new Map();
const ONE_DAY = 24 * 60 * 60 * 1000;

// ============================
// READY
// ============================
client.once("ready", () => {
  console.log(`Conectado como ${client.user.tag}`);
});

// ============================
// MENSAJES
// ============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content;

  if (content === ">ping") {
    return message.reply("Pong");
  }

  if (content === ">info") {
    return message.reply("Nexus Bot activo y funcionando");
  }

  if (content.toLowerCase().startsWith(".phase") || content.toLowerCase().startsWith(".ph")) {

    const allowedRoleId = "1457921277540040932";

    if (!message.member.roles.cache.has(allowedRoleId))
      return message.reply("No tienes permiso.");

    const args = content.trim().split(/\s+/);
    const member = message.mentions.members.first();

    if (!member)
      return message.reply("Usa: .phase @usuario p0-p5 low/mid/high weak/estable/strong");

    const phaseKey = args[2]?.toLowerCase();
    const level = args[3]?.toLowerCase();
    const state = args[4]?.toLowerCase();

    if (!phaseKey || !level || !state)
      return message.reply("Usa: .phase @usuario p0-p5 low/mid/high weak/estable/strong");

    const now = Date.now();
    const lastPhase = phaseCooldown.get(member.id);

    if (lastPhase && now - lastPhase < ONE_DAY) {
      const remaining = ONE_DAY - (now - lastPhase);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

      return message.reply(
        `Este usuario debe esperar ${hours}h ${minutes}m para una nueva evaluación.`
      );
    }

    const phaseRoles = {
      p0: "1458682851414380605",
      p1: "1458680324799201280",
      p2: "1476995979763912977",
      p3: "1458680188937175296",
      p4: "1458679781536043060",
      p5: "1458678850060947719"
    };

    const levelRoles = {
      low: "1458679384691970186",
      mid: "1458679896837586976",
      high: "1458680037912875151"
    };

    const stateRoles = {
      weak: "1458679584429178921",
      estable: "1458679985668755466",
      strong: "1458680108066930731"
    };

    const selectedPhase = phaseRoles[phaseKey];
    const selectedLevel = levelRoles[level];
    const selectedState = stateRoles[state];

    if (!selectedPhase) return message.reply("Phase invalida.");
    if (!selectedLevel) return message.reply("Nivel invalido.");
    if (!selectedState) return message.reply("Estado invalido.");

    try {

      const allRoles = [
        ...Object.values(phaseRoles),
        ...Object.values(levelRoles),
        ...Object.values(stateRoles)
      ];

      for (const id of allRoles) {
        if (member.roles.cache.has(id)) {
          await member.roles.remove(id).catch(() => {});
        }
      }

      await member.roles.add([selectedPhase, selectedLevel, selectedState]);

      phaseCooldown.set(member.id, now);

      const nextEvaluation = new Date(now + ONE_DAY).toLocaleString();

      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("★ PHASE SYSTEM ★")
        .setDescription(
          `★ Usuario: ${member}\n` +
          `★ Phase: ${phaseKey.toUpperCase()}\n` +
          `★ Tier: ${level.toUpperCase()}\n` +
          `★ Sub Tier: ${state.toUpperCase()}\n\n` +
          `★ Cooldown: 24 Horas\n` +
          `★ Proxima evaluacion: ${nextEvaluation}`
        )
        .setFooter({ text: `Asignado por ${message.author.tag}` })
        .setTimestamp();

      return message.reply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      return message.reply("Error al asignar roles.");
    }
  }
});

client.login(process.env.TOKEN);
