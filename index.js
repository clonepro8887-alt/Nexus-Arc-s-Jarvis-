import OpenAI from "openai";
import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

// ============================
//       OpenAI
// ============================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // toma la API key de Railway
});

// ============================
//       Discord Bot
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
//       Railway Server
// ============================
const app = express();

app.get("/", (req, res) => {
  res.send("🔥 Nexus Bot activo en Railway");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server activo en puerto ${PORT}`);
});

// ============================
//       Client Ready
// ============================
client.once("ready", () => {
  console.log(`Conectado como ${client.user.tag}`);
});

// ============================
//       Message Create
// ============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();

  // =========================
  //       PHASE SYSTEM
  // =========================
  if (content.startsWith(".phase") || content.startsWith(".ph")) {
    const allowedRoleId = "1457921277540040932"; // rol permitido para usar .phase
    if (!message.member.roles.cache.has(allowedRoleId))
      return message.reply("❌ No tienes el rol necesario para usar este comando.");

    const args = message.content.trim().split(/\s+/);
    const member = message.mentions.members.first();
    if (!member) return message.reply("Menciona a un usuario.");

    const phaseKey = args[2]?.toLowerCase();
    const level = args[3]?.toLowerCase();
    const state = args[4]?.toLowerCase();

    if (!phaseKey || !level || !state)
      return message.reply("Usa: .phase @user ph0/ph1/ph2/app1/ph3/ph4/ph5 nivel estado");

    const phaseRoles = {
      ph0: "1458682851414380605",
      ph1: "1458680324799201280",
      ph2: "1476995979763912977",
      app1: "1473427053561905363",
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
      // Quitar roles anteriores
      const allRoles = [
        ...Object.values(phaseRoles),
        ...Object.values(levelRoles),
        ...Object.values(stateRoles)
      ];

      for (const id of allRoles) {
        if (member.roles.cache.has(id)) {
          try { await member.roles.remove(id); } 
          catch (e) { console.log(`No se pudo quitar rol ${id} a ${member.user.tag}`); }
        }
      }

      // Añadir roles nuevos
      const addedRoles = [];
      for (const roleId of [selectedPhase, selectedLevel, selectedState]) {
        try {
          await member.roles.add(roleId);
          addedRoles.push(roleId);
        } catch (e) {
          console.log(`No se pudo asignar rol ${roleId} a ${member.user.tag}`);
        }
      }

      // Embed informativo
      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("PHASE ACTUALIZADA")
        .setDescription(
          `Usuario: ${member}\nPhase: ${phaseKey.toUpperCase()}\nNivel: ${level.toUpperCase()}\nEstado: ${state.toUpperCase()}\nRoles asignados: ${addedRoles.length}/3`
        )
        .setThumbnail("https://cdn.discordapp.com/attachments/1233881531404124202/1476661075138314260/a7010d0c5a38634ed065c269679e7fcd.gif")
        .setFooter({ text: `Asignado por: ${message.author.tag}` })
        .setTimestamp();

      return message.reply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
    }
  }

  // =========================
  //       RESPUESTA OPENAI
  // =========================
  if (!content.startsWith(".phase") && !message.author.bot) {
    try {
      if (content.trim().length === 0) return; // evita mensajes vacíos
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: message.content }],
        max_tokens: 150
      });
      const reply = response.choices[0].message.content;
      return message.reply(reply);
    } catch (err) {
      console.error("Error OpenAI:", err);
    }
  }
});

// ============================
//       LOGIN
// ============================
client.login(process.env.TOKEN);
