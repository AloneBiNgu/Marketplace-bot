const { Schema, default: mongoose } = require('mongoose');

const shop_schema = new Schema(
	{
		discord_id: {
			type: String,
			required: true,
			unique: true
		},

		category_id: {
			type: String,
			required: true
		},

		expiredAt: {
			type: Date,
			required: true,
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('shop', shop_schema);
