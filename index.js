// require the Commando module (using deconstruction)
const { CommandoClient } = require('discord.js-commando');
// require the path module
const path = require('path');

// dotenv to use environment variables
require('dotenv').config();

// require mongoose package
const mongoose = require('mongoose');


// declaring config variables
const uri = process.env.MONGODB_URI;
const prefix = process.env.PREFIX;
const ownerID = process.env.OWNERID;
const token = process.env.TOKEN;

// connect to the mongodb database. Supplied options to prevent deprecation warnings on execution
mongoose.connect(uri,
	{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => console.log('connected to db'))
	.catch((err) => console.log(err));

// create a new CommandoClient
const client = new CommandoClient({
	commandPrefix: prefix,
	owner: ownerID,
	invite: 'https://discord.gg/bRCvFy9',
});

// command handler
client.registry
	.registerDefaultTypes()
	.registerGroups([
		['music_commands', 'Music Commands'],
		['fun_commands', 'Fun Commands'],
		['bot_commands', 'Bot Commands'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		help:true,
		prefix:true,
		eval:true,
		ping:true,
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

// when the client is ready, run this code
// this event will only trigger one time after logging in
// It prints that the bot is ready to the console and set its status
// to the text in setActivity
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with Commando');
});

// If the logging in fails, it prints an error message
client.on('error', console.error);

// login to Discord with your app's token
client.login(token);

