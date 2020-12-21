const { Command } = require('discord.js-commando');

module.exports = class LeaveVoiceChannel extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['leave', 'exit'],
			group: 'bot_commands',
			memberName: 'leave',
			description: 'Leave a voice channel.',
		});
	}

	run(message) {
		const voiceChannel = message.member.voice.channel;
		// checks if member using command is in a voice channel
		if (voiceChannel) {
			// if the id(s) of voice channel(s) the bot is connected does match member's
			// voice channel id, leave member's voice channel
			if (this.client.voice.connections.some(conn => conn.channel.id === voiceChannel.id)) {
				// bot leaves the voice channel the member is connected to
				message.member.voice.channel.leave();
			}
			else {
				message.reply('DJ is not in the current channel');
			}
		}
		else {
			message.reply('You need to join a voice channel first!');
		}
	}
};