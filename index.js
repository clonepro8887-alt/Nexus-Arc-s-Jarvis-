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

client.once("ready", () => {
  console.log(`Conectado como ${client.user.tag}`);
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

  if (content.startsWith(".phase")) {

    if (!message.member.permissions.has("Administrator"))
      return message.reply("Solo administradores pueden usar este comando.");

    const args = message.content.split(" ");
    const member = message.mentions.members.first();

    if (!member) return message.reply("Menciona a un usuario.");

    const phaseNumber = args[2];
    const tier = args[3]?.toLowerCase();

    if (!phaseNumber || !tier)
      return message.reply("Usa: .phase @user número tier");

    const phaseRoles = {
      "1": "1458680324799201280",
      "2": "11458680268272439388",
      "3": "1458680188937175296",
      "4": "1458679781536043060",
      "5": "1458678850060947719"
    };

    const tierRoles = {
      low: "1458679384691970186",
      mid: "1458679896837586976",
      high: "1458680037912875151",
      weak: "1458679584429178921",
      estable: "1458679985668755466",
      strong: "1458680108066930731"
    };

    const selectedPhase = phaseRoles[phaseNumber];
    const selectedTier = tierRoles[tier];

    if (!selectedPhase || !selectedTier)
      return message.reply("Phase o tier inválido.");

    try {

      // Quitar phases anteriores
      for (const id of Object.values(phaseRoles)) {
        if (member.roles.cache.has(id)) await member.roles.remove(id);
      }

      // Quitar tiers anteriores
      for (const id of Object.values(tierRoles)) {
        if (member.roles.cache.has(id)) await member.roles.remove(id);
      }

      await member.roles.add(selectedPhase);
      await member.roles.add(selectedTier);

      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("PHASE ACTUALIZADA")
        .setDescription(
          `Usuario: ${member}\n` +
          `Phase: ${phaseNumber}\n` +
          `Tier: ${tier.toUpperCase()}`
        )
        .setThumbnail("https://cdn.discordapp.com/attachments/1233881531404124202/1476661075138314260/a7010d0c5a38634ed065c269679e7fcd.gif")
        .setFooter({ text: "Nexus System" })
        .setTimestamp();

      return message.reply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      return message.reply("Error asignando roles.");
    }
  }

  // =========================
  //      AUTO CHAT 5%
  // =========================

  const probabilidad = Math.random();

  if (probabilidad <= 0.05) {

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
