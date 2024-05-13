const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ChannelType,
	PermissionFlagsBits,
} = require('discord.js');

const ms = require('ms');
const { create_profile } = require('../../services/rent_service.service');

module.exports = {
	developer: true,
	category: 'developer',
	data: new SlashCommandBuilder()
		.setName('create_shop')
		.setDescription('Create a new shop')
		.addUserOption((user) =>
			user
				.setName('user')
				.setDescription('User to create a new shop')
				.setRequired(true)
		)
		.addStringOption((date) =>
			date
				.setName('expire')
				.setDescription('Expire time for new shop')
				.setRequired(true)
		),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true, fetchReply: true });
		const { ViewChannel, ManageChannels, SendMessages, AttachFiles } =
			PermissionFlagsBits;
		const { guild, options } = interaction;
		const user = options.getUser('user');
		const expire_date = ms(options.getString('expire'));

		const category = await guild.channels.create({
			name: `shop ➨ ${user.displayName}`,
			type: ChannelType.GuildCategory,
			permissionOverwrites: [
				{
					id: user.id,
					allow: [
						ViewChannel,
						ManageChannels,
						SendMessages,
						AttachFiles,
					],
				},
				{
					id: guild.roles.everyone.id,
					allow: [ViewChannel],
					deny: [SendMessages],
				},
			],
		});

		await create_profile(user.id, Date.now() + expire_date, category.id);

		return interaction.editReply({ content: 'Đã tạo shop thành công' });
	},
};
