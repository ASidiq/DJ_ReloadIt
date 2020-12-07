// The piece of code below gets us the command class
const { Command } = require('discord.js-commando');

// MeowCommand is a subclass of Command
module.exports = class MeowCommand extends Command {
	constructor(client) {
		// Gets us access to Command's constructor and method
		super(client, {
			// Name of the command
			name: 'meow',
			// Other names for the same command
			aliases: ['kitty-cat'],
			// Group the command is part of
			group: 'fun_commands',
			// Name of the member within the group (can be different from the name)
			memberName: 'meow',
			// Help text displayed when the help command is used
			description: 'Replies with a meow, kitty cat.',
			// Throttling allows command to be used only in a certain period of time
			throttling: {
				usages: 2,
				duration: 10,
				// meow will be limited to twice in a 10second period per user
			},
		});
	}
	// run method contains the code that is executed when the meow command is used
	run(message) {
		return message.say('Meow!');
	}
};