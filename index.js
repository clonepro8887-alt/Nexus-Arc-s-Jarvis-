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
client.once('ready', () => {
  console.log(`Bot listo como ${client.user.tag}`);
});

// 3️⃣ Comando .phase
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(".phase")) return;

  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    return message.reply("No tienes permiso para usar este comando ❌");
  }

  const args = message.content.split(/ +/);
  const member = message.mentions.members.first();
  if (!member) return message.reply("Debes mencionar a un usuario.");

  const text = args.slice(2).join(" ").toLowerCase();

  // Roles phase
  if (text.includes("phase 0")) {
    const role = message.guild.roles.cache.find(r => r.name === "Phase 0");
    if (role) await member.roles.add(role);
  }
  if (text.includes("phase 1")) {
    const role = message.guild.roles.cache.find(r => r.name === "Phase 1");
    if (role) await member.roles.add(role);
  }
  if (text.includes("phase 2")) {
    const role = message.guild.roles.cache.find(r => r.name === "Phase 2");
    if (role) await member.roles.add(role);
  }
  if (text.includes("phase 3")) {
    const role = message.guild.roles.cache.find(r => r.name === "Phase 3");
    if (role) await member.roles.add(role);
  }

  // Roles normales
  if (text.includes("mid")) {
    const role = message.guild.roles.cache.find(r => r.name === "Mid");
    if (role) await member.roles.add(role);
  }
  if (text.includes("stable")) {
    const role = message.guild.roles.cache.find(r => r.name === "Stable");
    if (role) await member.roles.add(role);
  }

  message.reply("Roles actualizados ✅");
});

// 4️⃣ Login del bot
client.login(process.env.TOKEN);
