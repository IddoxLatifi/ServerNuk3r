/**
 * DISCLAIMER:
 * This bot is provided solely for educational and demonstration purposes.
 * We assume no liability for any harm, damages, or misuse resulting from its use.
 * It is strictly prohibited to use this bot for any malicious or harmful activities.
 *
 * Created by @apt_start_latifi
 * Help: https://iddox.tech/
 */

const { SlashCommandBuilder, REST, Routes } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('r-delete')
    .setDescription('Löscht alle Rollen außer @everyone.'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    const guild = interaction.guild;
    if (!guild) {
      return await interaction.editReply({ content: 'Dieser Befehl kann nur in einer Guild ausgeführt werden.' });
    }
    try {
      const roles = guild.roles.cache.filter(role => role.name !== '@everyone');
      const deletableRoles = roles.filter(role => role.editable);
      const nonDeletableRoles = roles.filter(role => !role.editable);
      
      await Promise.all(deletableRoles.map(role => role.delete().catch(console.error)));
      
      let replyMsg = `All deletable roles have been deleted.`;
      if(nonDeletableRoles.size > 0) {
          replyMsg += ` ${nonDeletableRoles.size} Roles could not be deleted because they are above the bot in the hierarchy.`;
      }
      
      await interaction.editReply(replyMsg);
    } catch (error) {
      console.error('Error deleting roles:', error);
      await interaction.editReply({ content: 'Fehler beim Löschen der Rollen.' });
    }
  },
};

// Falls diese Datei direkt ausgeführt wird (z.B. via "node r-delete.js"),
// wird der Command als globaler Slash Command registriert.
if (require.main === module) {
  require('dotenv').config();
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  (async () => {
    try {
      console.log('Started refreshing global application (/) commands.');
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: [module.exports.data.toJSON()] }
      );
      console.log('Successfully reloaded global application (/) commands.');
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}
