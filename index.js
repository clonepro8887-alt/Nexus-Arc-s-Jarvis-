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

  if (!message.content.startsWith('!phase')) return;

  const args = message.content.slice(7).trim().split(/ +/);

  if (!args.length) {
    return message.reply('Escribe los roles después de !phase');
  }

  for (const roleName of args) {
    const role = message.guild.roles.cache.find(
      r => r.name.toLowerCase() === roleName.toLowerCase()
    );

    if (role) {
      await message.member.roles.add(role);
    }
  }

  message.reply('Roles asignados correctamente ✅');
});

client.login(process.env.TOKEN);
