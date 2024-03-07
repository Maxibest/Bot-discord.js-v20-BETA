const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, userMention } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription("Unban un membre")
    .addUserOption(option => option
      .setName('target')
      .setDescription('Le membre à kick')
      .setRequired(true))
    .addStringOption(option => option
      .setName('reason')
      .setDescription('La raison du kick')
      .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') ?? 'Sans raison';
    const userMention = interaction.member.toString();


    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return await interaction.reply('Tu ne peux pas unban ce membre')
    }

    try {
      const fetchBanned = await interaction.guild.fetch(target);

      if (!fetchBanned) {
        return interaction.reply('Ce membre n\'est pas banni !');
      }
      await interaction.guild.members.unban(target, { reason: reason });
      await interaction.reply(`${userMention} a unban le membre ${target.username} pour la raison suivante : ${reason}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('L\'utilisateur n\'est pas présent sur ce serveur ou il est déjà débanni !');
    }
  }
};

