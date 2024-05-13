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
	category: 'developer',
	data: new SlashCommandBuilder()
		.setName('vouch')
		.setDescription('Vouch')
		.addUserOption((user) =>
			user
				.setName('user')
				.setDescription('Vouch for someone')
				.setRequired(true)
		)
		.addStringOption((input) =>
			input
				.setName('review')
				.setDescription('Review user that u vouch for')
		),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */

	async execute(interaction) {
		await interaction.deferReply({ fetchReply: true });
		const { guild, options } = interaction;
		const user = options.getUser('user');
		const review = options.getString('review') || 'Unknow';

		const vouch_data = await vouch_service.vouch(user.id);

		const message = new EmbedBuilder()
			.setTitle(`Vouched for ${user.displayName}`)
			.addFields([
				{ name: 'Review:', value: `\`${review}\``, inline: true },
				{
					name: `${user.displayName}'s vouch:`,
					value: `\`${vouch_data.vouch}\``,
					inline: true,
				},
			])
			.setColor(Colors.Green)
			.setTimestamp();
		return interaction.editReply({ embeds: [message] });
	},
};
