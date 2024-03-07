const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Supprime un nombre spécifié de messages')
    .addNumberOption(option =>
      option.setName('nummessages')
        .setDescription('Nombre de messages à supprimer')
        .setRequired(true)),
  async execute(interaction) {
    const numMessages = interaction.options.getNumber('nummessages');

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return await interaction.reply('Tu ne peux pas utiliser cette commande bahahah rip 😘 !')
    }
    try {
      if (numMessages > 100) {
        await interaction.reply("La limite de suppression des messages Discord est de 100 messages !");
      } else {
        await interaction.channel.bulkDelete(numMessages);
        await interaction.reply('Les messages ont été supprimés avec succès.');
      }
    } catch (error) {
      interaction.reply(`Ah désolé, j\'ai rencontré une erreur qui doit être corrigée. Kaïto, aide-moi 🤖 ${error}`);
    }
  }
};
