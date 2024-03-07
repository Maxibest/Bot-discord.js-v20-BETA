const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Sélectionne un membre pour le kick')
    .addUserOption(option => option
      .setName('target')
      .setDescription('Le membre à kick')
      .setRequired(true))
    .addStringOption(option => option
      .setName('reason')
      .setDescription('La raison du kick')
      .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') ?? 'Sans raison';
    const userMention = interaction.member.toString();


    if (interaction.member && !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return await interaction.reply('Tu ne peux pas kick ce membre')
    } else {
      await interaction.reply(`Le membre ${target.username} a été expulsé par ${userMention} pour la raison suivante : ${reason}`);
    }


    try {
      await interaction.guild.members.kick(target, { reason: reason });
      console.log(`Le membre ${target ? target.username : 'inconnu'} a été expulsé par ${userMention} pour la raison suivante : ${reason}`);
    } catch (error) {
      console.error(`Une erreur s'est produite lors de l'expulsion du membre : ${error}`);
      if (error.code === 50013) {
        await interaction.reply('Je n\'ai pas la permission d\'expulser ce membre.');
      } else {
        await interaction.reply(`Impossible d'expulser le membre ${target ? target.username : 'inconnu'}.`);
      }
    }
  }
}
