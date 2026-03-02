import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

// ============================
// Discord Bot
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
// Railway Web Server
// ============================
const app = express();

app.get("/", (req, res) => {
  res.send("🔥 Nexus Bot activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server activo en puerto ${PORT}`));

// ============================
// Ready
// ============================
client.once("ready", () => {
  console.log(`Conectado como ${client.user.tag}`);
});

// ============================
// Mensajes
// ============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();

  // =========================
  // COMANDOS SIMPLES
  // =========================

  if (content === ">ping") {
    return message.reply("🏓 Pong!");
  }

  if (content === ">info") {
    return message.reply("🔥 Nexus Bot activo y funcionando sin IA.");
  }

  // =========================
  // PHASE SYSTEM (SIN APP1)
  // =========================

  if (content.startsWith(".phase") || content.startsWith(".ph")) {

    const allowedRoleId = "1457921277540040932";
    if (!message.member.roles.cache.has(allowedRoleId))
      return message.reply("❌ No tienes permiso.");

    const args = message.content.trim().split(/\s+/);
    const member = message.mentions.members.first();
    if (!member) return message.reply("Menciona a un usuario.");

    const phaseKey = args[2]?.toLowerCase();
    const level = args[3]?.toLowerCase();
    const state = args[4]?.toLowerCase();

    if (!phaseKey || !level || !state)
      return message.reply("Usa: .phase @user ph0/ph1/ph2/ph3/ph4/ph5 nivel estado");

    const phaseRoles = {
      ph0: "1458682851414380605",
      ph1: "1458680324799201280",
      ph2: "1476995979763912977",
      ph3: "1458680188937175296",
      ph4: "1458679781536043060",
      ph5: "1458678850060947719"
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

    if (!selectedPhase) return message.reply("Phase inválida.");
    if (!selectedLevel) return message.reply("Nivel inválido.");
    if (!selectedState) return message.reply("Estado inválido.");

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

      await member.roles.add(selectedPhase).catch(() => {});
      await member.roles.add(selectedLevel).catch(() => {});
      await member.roles.add(selectedState).catch(() => {});

      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("PHASE ACTUALIZADA")
        .setDescription(
          `Usuario: ${member}\n` +
          `Phase: ${phaseKey.toUpperCase()}\n` +
          `Nivel: ${level.toUpperCase()}\n` +
          `Estado: ${state.toUpperCase()}`
        )
        .setFooter({ text: `Asignado por ${message.author.tag}` })
        .setTimestamp();

      return message.reply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      return message.reply("❌ Error al asignar roles.");
    }
  }
});

// ============================
// Login
// ============================
client.login(process.env.TOKEN);
