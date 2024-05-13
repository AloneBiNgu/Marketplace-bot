const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ChannelType,
	PermissionFlagsBits,
	EmbedBuilder,
	Colors,
} = require('discord.js');

const ms = require('ms');
const { create_profile } = require('../../services/rent_service.service');
const vouch_service = require('../../services/vouch_service.service');

module.exports = {
	category: 'user',
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search for user')
		.addUserOption((user) =>
			user
				.setName('user')
				.setDescription('Search for user')
				.setRequired(true)
		),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true, fetchReply: true });
		const { options } = interaction;
		const user = options.getUser('user');

		const user_data = await vouch_service.search(user.id);
        let message;
        if (!user_data) {
            message = new EmbedBuilder()
			.setTitle(`Vouched for ${user.displayName}`)
			.addFields([
				{
					name: `${user.displayName}'s vouch:`,
					value: `\`0\``,
					inline: true,
				},
			])
			.setColor(Colors.Green)
			.setTimestamp();            
        } else {
            message = new EmbedBuilder()
			.setTitle(`Vouched for ${user.displayName}`)
			.addFields([
				{
					name: `${user.displayName}'s vouch:`,
					value: `\`${user_data.vouch}\``,
					inline: true,
				},
			])
			.setColor(Colors.Green)
			.setTimestamp();
        }

		return interaction.editReply({ embeds: [message] });
	},
};
