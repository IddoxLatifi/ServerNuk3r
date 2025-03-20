/**
 * DISCLAIMER:
 * This bot is provided solely for educational and demonstration purposes.
 * We assume no liability for any harm, damages, or misuse resulting from its use.
 * It is strictly prohibited to use this bot for any malicious or harmful activities.
 *
 * Created by @apt_start_latifi
 * Help: https://iddox.tech/
 */

const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Verteilt Embed-Nachrichten auf die Text-Channels der Guild.')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Titel der Embed-Nachricht')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Text der Embed-Nachricht')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('number')
        .setDescription('Anzahl der zu sendenden Nachrichten')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    const title = interaction.options.getString('title');
    const text = interaction.options.getString('text');
    const totalMessages = interaction.options.getInteger('number');

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(text)
      .setColor('#800080') 
      .setFooter({ text: "Created by @apt_start_latifi | https://iddox.tech/" });

    const guild = interaction.guild;
    if (!guild) {
      return await interaction.editReply({ content: "Dieser Befehl kann nur in einer Guild ausgeführt werden." });
    }
    const textChannels = guild.channels.cache.filter(channel =>
      channel.type === ChannelType.GuildText &&
      channel.permissionsFor(guild.members.me).has('SendMessages')
    );
    
    if (textChannels.size === 0) {
      return await interaction.editReply({ content: "Keine Text-Channels gefunden, in denen der Bot Nachrichten senden kann." });
    }
    
    const channelsArray = Array.from(textChannels.values());
    const channelCount = channelsArray.length;
    const messagesPerChannel = Math.floor(totalMessages / channelCount);
    const remainder = totalMessages % channelCount;

    const sendPromises = [];
    channelsArray.forEach((channel, index) => {
      let messagesToSend = messagesPerChannel + (index < remainder ? 1 : 0);
      for (let i = 0; i < messagesToSend; i++) {
        sendPromises.push(
          channel.send({ content: "@everyone", embeds: [embed] })
        );
      }
    });

    try {
      await Promise.all(sendPromises);
      await interaction.editReply(`Es wurden insgesamt ${totalMessages} Nachrichten verteilt.`);
    } catch (error) {
      console.error('Fehler beim Senden der Nachrichten:', error);
      await interaction.editReply('Fehler beim Senden der Nachrichten.');
    }
  },
};
