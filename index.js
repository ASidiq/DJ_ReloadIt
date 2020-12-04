// require the Commando module
const { CommandoClient } = require('discord.js-commando');
// require the path module
const path = require('path');
// require the config file
const config = require('./config.json');

// create a new CommandoClient
const client = new CommandoClient({
	commandPrefix: config.prefix,
	owner: config.ownerID,
	invite: 'https://discord.gg/bRCvFy9',
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['actions', 'Your Actions Command Group'],
		// ['second', 'Your Second Command Group'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with Commando');
});

// If the loggin in fails, it prints an error message
client.on('error', console.error);

// login to Discord with your app's token
client.login(config.token);
