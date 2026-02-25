const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot activo ✅');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor web activo en puerto ${PORT}`);
});

const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`Bot listo como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('.phase')) return;

  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    return message.reply('No tienes permiso para usar este comando ❌');
  }

  const args = message.content.split(/ +/);
  const member = message.mentions.members.first();

  if (!member) {
    return message.reply('Debes mencionar a un usuario.');
  }

  const rolesArgs = args.slice(2);

  if (!rolesArgs.length) {
    return message.reply('Debes escribir los roles después del usuario.');
  }

  for (const roleName of rolesArgs) {
    const role = message.guild.roles.cache.find(
      r => r.name.toLowerCase() === roleName.toLowerCase()
    );

    if (role) {
      try {
        await member.roles.add(role);
      } catch (err) {
        console.log(`No se pudo asignar el rol ${roleName}`);
      }
    }
  }

  message.reply('Roles asignados correctamente ✅');
});

client.login(process.env.TOKEN);
