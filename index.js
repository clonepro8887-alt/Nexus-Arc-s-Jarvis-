const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`🔥 Bot listo como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // =================================================
  // 🔥 COMANDO .PHASE
  // =================================================
  if (message.content.startsWith(".phase")) {

    const args = message.content.trim().split(/\s+/);
    const member = message.mentions.members.first();
    const phaseInput = args[2]?.toLowerCase();
    const extras = args.slice(3).map(e => e.toLowerCase());

    if (!member) return message.reply("Menciona a un usuario.");
    if (!phaseInput) return message.reply("Pon una fase.");

    const roles = {
      1: "1476743660484956204",
      2: "1476743716667527291",
      3: "1476743749542609048",
      4: "1476743770304155811",
      5: "1476743788973260954",
      app: "1476743732584775722",

      low: "1476744695282532485",
      mid: "1476744806897287239",
      high: "1476744734830498065",

      weak: "1476744710793068706",
      strong: "1476744781253185688",
      stable: "1476744819043860591"
    };

    if (!roles[phaseInput])
      return message.reply("Fase inválida (1-5 o app).");

    try {

      // 🧹 Quitar todos los roles del sistema
      for (let key in roles) {
        if (member.roles.cache.has(roles[key])) {
          await member.roles.remove(roles[key]);
        }
      }

      // ➕ Agregar fase
      await member.roles.add(roles[phaseInput]);

      // ➕ Agregar extras válidos
      let extrasAgregados = [];

      for (let extra of extras) {
        if (roles[extra]) {
          await member.roles.add(roles[extra]);
          extrasAgregados.push(extra);
        }
      }

      return message.channel.send(
        `🔥 ${member.user.username} ahora está en ${phaseInput} ${extrasAgregados.join(" ")}`
      );

    } catch (err) {
      console.error(err);
      return message.reply("Error al asignar roles.");
    }
  }

  // =================================================
  // 🤖 AUTO CHAT 40%
  // =================================================
  if (Math.random() < 0.40) {

    const respuestas = [
      "Y que we 😂",
      "Hablen bien ps",
      "Ta fuerte eso 👀",
      "XD",
      "Eso sonó personal 😭",
      "Estoy leyendo todo 👁️"
    ];

    const random = respuestas[Math.floor(Math.random() * respuestas.length)];

    message.channel.send(random);
  }
});

client.login(process.env.TOKEN);
