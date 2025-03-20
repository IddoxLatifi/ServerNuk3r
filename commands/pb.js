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
        .setName('pb')
        .setDescription('Ändert das Serverbild (Icon).')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL zum Bild')
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const guild = interaction.guild;
        if (!guild) {
            return interaction.reply({ content: 'Dieser Befehl kann nur in einer Guild ausgeführt werden.', ephemeral: true });
        }
        try {
            await guild.setIcon(url);
            await interaction.reply("Serverbild wurde geändert.");
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Fehler beim Ändern des Serverbildes.', ephemeral: true });
        }
    },
};
