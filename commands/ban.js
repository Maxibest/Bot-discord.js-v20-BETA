const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Sélectionne un membre pour le ban')
    .addUserOption(option => option
      .setName('target')
      .setDescription('Le membre à ban')
      .setRequired(true))
    .addStringOption(option => option
      .setName('reason')
      .setDescription('La raison du ban')
      .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') ?? 'Sans raison';
    const userMention = interaction.member.toString();

    if (interaction.member && !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return await interaction.reply('Vous ne pouvez pas ban ce membre')
    } else {
      await interaction.reply(`Le membre ${target.username} a été banni par ${userMention} pour la raison suivante : ${reason}`);
    }


    try {
      await interaction.guild.members.ban(target, { reason: reason });
      console.log(`Le membre ${target.username} a été banni par ${userMention} pour la raison suivante : ${reason}`);
    } catch (error) {
      console.error(`Une erreur s'est produite lors du ban du membre : ${error}`);
      await interaction.reply(`Impossible de ban le membre ${target.username}.`);
    }
  }
};

