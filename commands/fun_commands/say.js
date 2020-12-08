const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['parrot', 'copy'],
			group:'fun_commands',
			memberName: 'say',
			description: 'Replies with the text you provide.',
			// args is an array of objects, each containing data for that argument
			args: [
				{
					// name of the argument. Will be used the in the run method
					key: 'text',
					// prompt is the text that is displayed if no argument is provided
					prompt: 'What text would you like the bot to say?',
					// type is the type the argument is a part of e.g. string, integer,
					// user, member, etc.
					type:'string',
				},
				{
					key: 'otherThing',
					prompt: 'What is this other useless thing?',
					type: 'string',
					// what the argument default to if none is provided
					default:'dog',
				},
			],
		});
	}

	run(message, { text }) {
		return message.reply(text);
	}
};