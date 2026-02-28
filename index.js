import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch"; // npm install node-fetch
dotenv.config();

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
app.listen(PORT, () => console.log(`Server activo en puerto ${PORT}`));

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
    const allowedRoleId = "1457921277540040932"; // rol permitido
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
      // Quitar roles antiguos
      const allRoles = [...Object.values(phaseRoles), ...Object.values(levelRoles), ...Object.values(stateRoles)];
      for (const id of allRoles) {
        if (member.roles.cache.has(id)) {
          try { await member.roles.remove(id); } catch { }
        }
      }

      // Añadir roles nuevos
      const addedRoles = [];
      for (const roleId of [selectedPhase, selectedLevel, selectedState]) {
        try {
          await member.roles.add(roleId);
          addedRoles.push(roleId);
        } catch { }
      }

      // Embed
      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("PHASE ACTUALIZADA")
        .setDescription(
          `Usuario: ${member}\n` +
          `Phase: ${phaseKey.toUpperCase()}\n` +
          `Nivel: ${level.toUpperCase()}\n` +
          `Estado: ${state.toUpperCase()}\n` +
          `Roles asignados: ${addedRoles.length}/3`
        )
        .setThumbnail("https://cdn.discordapp.com/attachments/1233881531404124202/1476661075138314260/a7010d0c5a38634ed065c269679e7fcd.gif")
        .setFooter({ text: `Asignado por: ${message.author.tag}` })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (err) { console.error(err); }
  }

  // =========================
  //       ASK HUGGING FACE
  // =========================
  if (content.startsWith(">ask")) {
    const question = message.content.slice(4).trim();
    if (!question) return message.reply("❌ Escribe tu pregunta después de `>ask`.");

    try {
      const res = await fetch("https://router.huggingface.co/models/gpt2", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: question,
          parameters: { max_new_tokens: 150 }
        })
      });

      const data = await res.json();
      if (data.error) return message.reply("❌ Error Hugging Face: " + data.error);

      const reply = data[0]?.generated_text || "❌ No se pudo generar respuesta.";
      return message.reply(reply);

    } catch (err) {
      console.error("Error Hugging Face:", err);
      return message.reply("❌ Ocurrió un error al conectar con Hugging Face.");
    }
  }
});

// ============================
//       LOGIN
// ============================
client.login(process.env.TOKEN);
