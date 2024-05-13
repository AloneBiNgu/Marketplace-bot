const shop_schema = require('../db/models/shop.model');

class rent {
	async create_profile(discord_id, expiredAt, category_id) {
		const user = await shop_schema.findOneAndUpdate(
			{ discord_id },
			{
				$set: {
					discord_id,
				},
			},
			{ new: true }
		);

        if (!user) {
            const new_user = await shop_schema.create({
                discord_id,
                category_id,
                expiredAt
            });
            return new_user;
        }
        return user;
	}

    async remove_profile(discord_id) {
        return shop_schema.findOneAndDelete({ discord_id });
    }

    async get_profile(discord_id) {
        return shop_schema.findOne({ discord_id });
    }

    async get_profiles() {
        return shop_schema.find({});
    }
}

module.exports = new rent();
