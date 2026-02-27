const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ============================
//        RAILWAY SERVER
// ============================
const app = express();

app.get("/", (req, res) => {
  res.send("Nexus Bot activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server activo en puerto ${PORT}`);
});

// ============================
//        CLIENT READY
// ============================
client.once("clientReady", (c) => {
  console.log(`Conectado como ${c.user.tag}`);
});

// ============================
//        MESSAGE CREATE
// ============================
client.on("messageCreate", async (message) => {

  if (message.author.bot) return;
  const content = message.content.toLowerCase();

  // =========================
  //        PHASE SYSTEM
  // =========================
  if (content.startsWith(".phase") || content.startsWith(".ph")) {

    if (!message.member.permissions.has("Administrator"))
      return message.reply("Solo administradores pueden usar este comando.");

    const args = message.content.trim().split(/\s+/);
    const member = message.mentions.members.first();
    if (!member) return message.reply("Menciona a un usuario.");

    const phaseNumber = args[2];
    const level = args[3]?.toLowerCase();
    const state = args[4]?.toLowerCase();

    if (!phaseNumber || !level || !state)
      return message.reply("Usa: .phase @user numero level state");

    const phaseRoles = {
      "0": "1458682851414380605",
      "1": "1458680324799201280",
      "2": "1476995979763912977", // Phase 2 corregido
      "3": "1458680188937175296",
      "4": "1458679781536043060",
      "5": "1458678850060947719",
      "app": "1473427053561905363"
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

    const selectedPhase = phaseRoles[phaseNumber];
    const selectedLevel = levelRoles[level];
    const selectedState = stateRoles[state];

    if (!selectedPhase) return message.reply("Phase inválida.");
    if (!selectedLevel) return message.reply("Nivel inválido.");
    if (!selectedState) return message.reply("Estado inválido.");

    try {

      // Quitar todas las phases y niveles anteriores
      const allRoles = [
        ...Object.values(phaseRoles),
        ...Object.values(levelRoles),
        ...Object.values(stateRoles)
      ];

      for (const id of allRoles) {
        if (member.roles.cache.has(id)) {
          await member.roles.remove(id);
        }
      }

      // Añadir roles nuevos
      await member.roles.add(selectedPhase);
      await member.roles.add(selectedLevel);
      await member.roles.add(selectedState);

      // Embed
      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("PHASE ACTUALIZADA")
        .setDescription(
          `Usuario: ${member}\n` +
          `Phase: ${phaseNumber}\n` +
          `Nivel: ${level.toUpperCase()}\n` +
          `Estado: ${state.toUpperCase()}`
        )
        .setThumbnail("https://cdn.discordapp.com/attachments/1233881531404124202/1476661075138314260/a7010d0c5a38634ed065c269679e7fcd.gif")
        .setFooter({ text: "Nexus System" })
        .setTimestamp();

      return message.reply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      return message.reply("Error asignando roles. Revisa permisos y posición del bot.");
    }
  }

  // =========================
  //      AUTO CHAT 5%
  // =========================
  if (Math.random() <= 0.05) {
    const burlas = [
      "tas medio lento ah",
      "más rápido mi internet",
      "anda practica un poco",
      "concentrate mejor",
      "modo ahorro activado?"
    ];
    const randomBurla = burlas[Math.floor(Math.random() * burlas.length)];
    return message.reply(randomBurla);
  }

  // =========================
  //      RESPUESTAS NORMALES
  // =========================
  if (content.includes("hola") || content.includes("buenas")) {
    return message.reply("Habla.");
  }

  if (content.includes("nexus")) {
    return message.reply("Nexus activo.");
  }

  if (content.includes("quien manda")) {
    return message.reply("El sistema.");
  }

  if (content.includes("me aburro")) {
    return message.reply("Entrena más.");
  }

  if (message.mentions.has(client.user)) {
    return message.reply("¿Qué necesitas?");
  }

});

// ============================
//        LOGIN
// ============================
client.login(process.env.TOKEN);
