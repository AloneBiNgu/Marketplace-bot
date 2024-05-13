const vouch_model = require("../db/models/vouch.model");

class vouch_service {
    async vouch(discord_id) {
        const user = await vouch_model.findOneAndUpdate({ discord_id }, {
            $inc: {
                vouch: 1
            }
        });

        if (!user) {
            const new_user = await vouch_model.create({
                discord_id
            });
            return new_user;
        }
        return user;
    }

    async search(discord_id) {
        const user = await vouch_model.findOne({ discord_id });
        return user;
    }
}

module.exports = new vouch_service;