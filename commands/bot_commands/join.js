const { Command } = require('discord.js-commando');

module.exports = class JoinVoiceChannel extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: ['join', 'enter'],
			group: 'bot_commands',
			memberName: 'join',
			description: 'Join a voice channel.',
		});
	}

	run(message) {
		const voiceChannel = message.member.voice.channel;
		// checks if member using command is in a voice channel
		if (voiceChannel) {
			// if the id(s) of voice channel(s) the bot is connected does not match member's
			// voice channel id, join member's voice channel id
			if (!this.client.voice.connections.some(conn => conn.channel.id === voiceChannel.id)) {
				// bot joins the same voice channel as member
				message.member.voice.channel.join();
			}
			else {
				message.reply('DJ already in channel');
			}
		}
		else {
			message.reply('You need to join a voice channel first!');
		}
	}
};