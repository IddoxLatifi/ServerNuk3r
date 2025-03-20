/**
 * DISCLAIMER:
 * This bot is provided solely for educational and demonstration purposes.
 * We assume no liability for any harm, damages, or misuse resulting from its use.
 * It is strictly prohibited to use this bot for any malicious or harmful activities.
 *
 * Created by @apt_start_latifi
 * Help: https://iddox.tech/
 */

const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('r-create')
    .setDescription('Erstellt neue Rollen in der Guild mit dem angegebenen Titel.')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Titel der Rolle')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('number')
        .setDescription('Anzahl der zu erstellenden Rollen')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const title = interaction.options.getString('title');
    const number = interaction.options.getInteger('number');
    const guild = interaction.guild;
    if (!guild) {
      return await interaction.editReply({ content: 'Dieser Befehl kann nur in einer Guild ausgeführt werden.' });
    }

    try {
      const rolePromises = [];
      for (let i = 0; i < number; i++) {
        rolePromises.push(guild.roles.create({
          name: title, 
          reason: 'Mass role creation',
        }));
      }
      await Promise.all(rolePromises);
      await interaction.editReply(`${number} Rollen mit dem Titel "${title}" wurden erstellt.`);
    } catch (error) {
      console.error('Fehler beim Erstellen der Rollen:', error);
      await interaction.editReply('Fehler beim Erstellen der Rollen.');
    }
  },
};
