// require the Commando module (using deconstruction)
const { CommandoClient } = require('discord.js-commando');
// require the path module
const path = require('path');
// require the config file
const { prefix, ownerID, token } = require('./config.json');

// create a new CommandoClient
const client = new CommandoClient({
	commandPrefix: prefix,
	owner: ownerID,
	invite: 'https://discord.gg/bRCvFy9',
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['music_commands', 'Your Actions Command Group'],
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
client.login(token);

client.on('message', message => {
	console.log(message.content);
	if (message.content === `${token}ping`) {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('Pong!');
	}
});
