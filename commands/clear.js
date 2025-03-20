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
    .setName('clear')
    .setDescription('Löscht alle Channels in der Guild.'),
  async execute(interaction) {
    await interaction.reply({ content: "Channels werden gelöscht...", ephemeral: true });
    setTimeout(async () => {
      try {
        const guild = interaction.guild;
        if (!guild) return;
        const deletionPromises = [];
        for (const channel of guild.channels.cache.values()) {
          deletionPromises.push(channel.delete().catch(console.error));
        }
        await Promise.all(deletionPromises);
      } catch (error) {
        console.error("Fehler beim Löschen der Channels:", error);
      }
    }, 1000);
  },
};
