// 0️⃣ Express para Render Web Service
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot online ✅");
});

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

  // 🔥 Roles phase
  const phases = ["Phase 0", "Phase 1", "Phase 2", "Phase 3"];
  for (const phase of phases) {
    if (text.includes(phase.toLowerCase())) {
      const role = message.guild.roles.cache.find((r) => r.name === phase);
      if (role) {
        try {
          await member.roles.add(role);
        } catch (err) {
          console.log(`No se pudo asignar ${role.name}: ${err.message}`);
        }
      }
    }
  }

  // 🔥 Roles normales
  const normalRoles = ["Mid", "Stable"];
  for (const rName of normalRoles) {
    if (text.includes(rName.toLowerCase())) {
      const role = message.guild.roles.cache.find((r) => r.name === rName);
      if (role) {
        try {
          await member.roles.add(role);
        } catch (err) {
          console.log(`No se pudo asignar ${role.name}: ${err.message}`);
        }
      }
    }
  }

  message.reply("Roles actualizados ✅");
});

// 4️⃣ Login del bot
client.login(process.env.TOKEN);
