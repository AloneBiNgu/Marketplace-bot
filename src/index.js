require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const {
	Client,
	Collection,
	GatewayIntentBits,
	Routes,
	REST,
} = require('discord.js');
const {
	get_profiles,
	remove_profile,
} = require('./services/rent_service.service');

const client = new Client({ intents: 3276799 });

client.commands = new Collection();
let foldersPath = path.join(__dirname, 'commands');
let commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

client.buttons = new Collection();
foldersPath = path.join(__dirname, 'buttons');
commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.buttons.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

client.modals = new Collection();
foldersPath = path.join(__dirname, 'modals');
commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.modals.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

require('./db/connect')();
require('./deploy_command')();

client.login(process.env.BOT_TOKEN).then(() => {
	cron.schedule('*/10 * * * * *', async () => {
		try {
			const docs = await get_profiles();
			const guild = await client.guilds.fetch(process.env.GUILD_ID);

			docs.forEach(async (shop) => {
				const date_now = Date.now();
				const expiredAt = shop.expiredAt;

				if (date_now > expiredAt) {
					const category = guild.channels.cache.get(shop.category_id);
					if (category && category.type === 4) {
                        category.children.cache.each(async (channel) => {
                            channel.delete();
							console.log(`Deleted channel ${channel.name}`);
                        });
                        category.delete();
                    }
                    remove_profile(shop.discord_id);
				}
			});
		} catch (error) {
			console.error(error);
		}
	});
});
