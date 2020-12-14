const { Command } = require('discord.js-commando');

module.exports = class PauseMusic extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			aliases: ['pause-music', 'pause-song', 'hold', 'paused'],
			group: 'music_commands',
			memberName: 'pause',
			description: 'Pause the music.',
		});
	}

	run(message) {
		// checks if member using command is in a voice channel
		if (message.member.voice.channel) {
			// stores current name of bot's activity
			const activityName = this.client.user.presence.activities[0].name;
			// if bot's activity is not both of the text, then it is playing music
			if (activityName != 'Music Paused...' && activityName != 'with Commando') {
				// bot joins the same voice channel as member or stays in if it is already there
				message.member.voice.channel.join()
					.then(connection => {
						// connection returns a VoiceConnection and dispatcher returns a StreamDispatcher
						connection.dispatcher.pause({ value: true });
						// Types: PLAYING, WATCHING, LISTENING, STREAMING,
						this.client.user.setActivity('Music Paused...');
					});
			}
			else if (activityName === 'Music Paused...') {
				message.reply('Music is paused already');
			}
			else {
				message.reply('No music is currently playing');
			}
		}
		else {
			message.reply('You need to join a voice channel first!');
		}
	}
};