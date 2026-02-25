client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(".")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "phase") {

    if (!message.member.permissions.has("ManageRoles")) {
      return message.reply("No tienes permiso para usar este comando.");
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply("Menciona a un usuario.");

    const text = args.join(" ").toLowerCase();

    // PHASE ROLES
    if (text.includes("phase 0")) {
      const role = message.guild.roles.cache.find(r => r.name === "Phase 0");
      if (role) member.roles.add(role);
    }

    if (text.includes("phase 1")) {
      const role = message.guild.roles.cache.find(r => r.name === "Phase 1");
      if (role) member.roles.add(role);
    }

    if (text.includes("phase 2")) {
      const role = message.guild.roles.cache.find(r => r.name === "Phase 2");
      if (role) member.roles.add(role);
    }

    if (text.includes("phase 3")) {
      const role = message.guild.roles.cache.find(r => r.name === "Phase 3");
      if (role) member.roles.add(role);
    }

    // MID
    if (text.includes("mid")) {
      const role = message.guild.roles.cache.find(r => r.name === "Mid");
      if (role) member.roles.add(role);
    }

    // STABLE
    if (text.includes("stable")) {
      const role = message.guild.roles.cache.find(r => r.name === "Stable");
      if (role) member.roles.add(role);
    }

    message.channel.send("Roles actualizados.");
  }
});
