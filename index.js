const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot listo como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('.phase')) return;

  // Solo admins pueden usarlo (opcional pero recomendado)
  if (!message.member.permissions.has('ManageRoles')) {
    return message.reply('No tienes permiso para usar este comando ❌');
  }

  const args = message.content.split(/ +/);

  const member = message.mentions.members.first();
  if (!member) {
    return message.reply('Debes mencionar a un usuario.');
  }

  // Roles después del usuario
  const rolesArgs = args.slice(2);

  for (const roleName of rolesArgs) {
    const role = message.guild.roles.cache.find(
      r => r.name.toLowerCase() === roleName.toLowerCase()
    );

    if (role) {
      await member.roles.add(role);
    }
  }

  message.reply('Roles asignados correctamente ✅');
});

client.login(process.env.TOKEN);
