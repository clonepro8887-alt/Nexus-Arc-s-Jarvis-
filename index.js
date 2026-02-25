// 0️⃣ Express para Render Web Service
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Bot online ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor web activo en puerto ${PORT}`));

// 1️⃣ Definir client
const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// 2️⃣ Event cuando el bot está listo
client.once("ready", () => {
  console.log(`Bot listo como ${client.user.tag}`);

  // 🔹 Auto mensaje cada 5 minutos para mantener activo el bot
  const channel = client.channels.cache.get("1458171162965180524"); // tu ID de canal
  if (channel) {
    setInterval(() => {
      channel.send("¡Estoy vivo! 🔥").catch(() => {});
    }, 5 * 60 * 1000); // 5 minutos
  } else {
    console.log("Canal para auto mensaje no encontrado");
  }
});

// 3️⃣ Comando .phase
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(".phase")) return;

  // Solo staff
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    return message.reply("No tienes permiso para usar este comando ❌");
  }

  const args = message.content.split(/ +/);
  const member = message.mentions.members.first();
  if (!member) return message.reply("Debes mencionar a un usuario.");

  const text = args.slice(2).join(" ").toLowerCase();

  // 🔹 Listas de roles
  const phases = ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "App Ph 1"];
  const normalRoles = ["Low", "Weak", "Mid", "Stable", "High", "Strong"];

  // 1️⃣ Eliminar roles antiguos (solo de tus listas)
  for (const phase of phases) {
    const role = message.guild.roles.cache.find(r => r.name === phase);
    if (role && member.roles.cache.has(role.id)) {
      try {
        await member.roles.remove(role);
      } catch {}
    }
  }

  for (const rName of normalRoles) {
    const role = message.guild.roles.cache.find(r => r.name === rName);
    if (role && member.roles.cache.has(role.id)) {
      try {
        await member.roles.remove(role);
      } catch {}
    }
  }

  // 2️⃣ Dar roles nuevos
  for (const phase of phases) {
    if (text.includes(phase.toLowerCase())) {
      const role = message.guild.roles.cache.find(r => r.name === phase);
      if (role) {
        try {
          await member.roles.add(role);
        } catch {}
      }
    }
  }

  for (const rName of normalRoles) {
    if (text.includes(rName.toLowerCase())) {
      const role = message.guild.roles.cache.find(r => r.name === rName);
      if (role) {
        try {
          await member.roles.add(role);
        } catch {}
      }
    }
  }

  message.reply("Roles actualizados ✅");
});

// 4️⃣ Login del bot
client.login(process.env.TOKEN);
