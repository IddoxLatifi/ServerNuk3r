/**
 * DISCLAIMER:
 * This bot is provided solely for educational and demonstration purposes.
 * We assume no liability for any harm, damages, or misuse resulting from its use.
 * It is strictly prohibited to use this bot for any malicious or harmful activities.
 *
 * Created by @apt_start_latifi
 * Help: https://iddox.tech/
 */

const { SlashCommandBuilder, ChannelType } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Erstellt neue Channels in der Guild.')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name des Channels')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('number')
        .setDescription('Anzahl der zu erstellenden Channels')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Wähle den Channel-Typ')
        .setRequired(true)
        .addChoices(
          { name: 'Text', value: 'text' },
          { name: 'Voice', value: 'voice' },
          { name: 'Random', value: 'random' }
        )),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const channelName = interaction.options.getString('name');
    const number = interaction.options.getInteger('number');
    const type = interaction.options.getString('type');
    const guild = interaction.guild;
    if (!guild) {
      return await interaction.editReply({ content: 'Dieser Befehl kann nur in einer Guild ausgeführt werden.' });
    }

    try {
      const createPromises = [];
      for (let i = 0; i < number; i++) {
        let channelType;
        if (type === 'random') {
          channelType = (i % 2 === 0) ? ChannelType.GuildText : ChannelType.GuildVoice;
        } else if (type === 'text') {
          channelType = ChannelType.GuildText;
        } else if (type === 'voice') {
          channelType = ChannelType.GuildVoice;
        } else {
          return await interaction.editReply({ content: 'Ungültiger Channel-Typ ausgewählt.' });
        }
        createPromises.push(guild.channels.create({
          name: channelName,
          type: channelType,
        }));
      }
      await Promise.all(createPromises);
      await interaction.editReply(`${number} Channels (${type}) mit dem Namen "${channelName}" wurden erstellt.`);
    } catch (error) {
      console.error('Fehler beim Erstellen der Channels:', error);
      await interaction.editReply('Fehler beim Erstellen der Channels.');
    }
  },
};
