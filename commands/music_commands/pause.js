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
		if (message.member.voice.channel) {
			message.member.voice.channel.join()
				.then(connection => {
					// connection returns a VoiceConnection and dispatcher returns a StreamDispatcher
					connection.dispatcher.pause([true]);
					// Types: PLAYING, WATCHING, LISTENING, STREAMING,
					this.client.user.setActivity('Paused...', { type: 'PLAYING' });
				});
		}
		else {
			message.reply('You need to join a voice channel first!');
		}
	}
};