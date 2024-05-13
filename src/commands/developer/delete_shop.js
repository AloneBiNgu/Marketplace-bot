const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ChannelType,
	PermissionFlagsBits,
} = require('discord.js');

const ms = require('ms');
const { get_profile, remove_profile } = require('../../services/rent_service.service');

module.exports = {
	developer: true,
	category: 'developer',
	data: new SlashCommandBuilder()
		.setName('delete_shop')
		.setDescription('Delete a shop')
		.addUserOption((user) =>
			user
				.setName('user')
				.setDescription('User to delete the shop channel')
				.setRequired(true)
		),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true, fetchReply: true });
		const { guild, options } = interaction;
		const user = options.getUser('user');

		const shop = await get_profile(user.id);
		const category = guild.channels.cache.get(shop.category_id);
        if (category && category.type === 4) {
            category.children.cache.each(async (channel) => {
                channel.delete();
            });
            category.delete();
        }
        remove_profile(shop.discord_id);

		return interaction.editReply({ content: 'Đã xoá shop thành công' });
	},
};
