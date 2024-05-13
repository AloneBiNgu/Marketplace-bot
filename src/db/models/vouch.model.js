const { Schema, default: mongoose } = require('mongoose');

const vouch_schema = new Schema(
	{
		discord_id: {
			type: String,
			required: true,
			unique: true,
		},

		vouch: {
			type: Number,
			default: 1,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('vouch', vouch_schema);
