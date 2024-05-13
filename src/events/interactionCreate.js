const {
	Events,
	EmbedBuilder,
	ChatInputCommandInteraction,
} = require('discord.js');
const admin_list = require('../config/admin.json');

module.exports = {
	name: Events.InteractionCreate,

	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */

	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(
				interaction.commandName
			);

			if (!command) {
				await interaction.reply({
					content: `No command matching \`${interaction.commandName}\` was found.`,
					ephemeral: true,
				});
				return;
			}

			try {
				if (command.catagory == 'developer') {
					if (admin_list.indexOf(interaction.user.id) === -1) {
						await interaction.deferReply({
							fetchReply: true,
							ephemeral: true,
						});
						const message = new EmbedBuilder()
							.setTitle('Bot')
							.addFields({
								name: 'Error:',
								value: `\`\`\`You don't have permission to use this command\`\`\``,
							})
							.setTimestamp();
						return interaction.editReply({
							embeds: [message],
						});
					}
				}
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content:
							'There was an error while executing this command!',
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content:
							'There was an error while executing this command!',
						ephemeral: true,
					});
				}
			}
		}

		if (interaction.isButton()) {
			const command_name =
				interaction.customId.split('-')[0] || interaction.customId;
			const command = interaction.client.buttons.get(command_name);

			if (!command) {
				console.error(`No command matching ${command_name} was found.`);
				return;
			}

			try {
				if (command.catagory == 'developer') {
					if (!admin_list.includes(interaction.user.id)) {
						await interaction.deferReply({
							fetchReply: true,
							ephemeral: true,
						});
						const message = new EmbedBuilder()
							.setTitle('Bot')
							.addFields({
								name: 'Error:',
								value: `\`\`\`You don't have permission to use this command\`\`\``,
							})
							.setTimestamp();
						return interaction.editReply({
							embeds: [message],
						});
					}
				}
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content:
							'There was an error while executing this command!',
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content:
							'There was an error while executing this command!',
						ephemeral: true,
					});
				}
			}
		}

		if (interaction.isModalSubmit()) {
			const command = interaction.client.modals.get(interaction.customId);

			if (!command) {
				console.error(
					`No command matching ${interaction.commandName} was found.`
				);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content:
							'There was an error while executing this command!',
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content:
							'There was an error while executing this command!',
						ephemeral: true,
					});
				}
			}
		}
	},
};
