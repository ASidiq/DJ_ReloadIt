const { Command } = require('discord.js-commando');
const Track = require('../../models/track.js');

module.exports = class ResumeMusic extends Command {
	constructor(client) {
		super(client, {
			name: 'resume',
			aliases: ['resume-music', 'resume-song', 'unpause'],
			group: 'music_commands',
			memberName: 'resume',
			description: 'Resumes the music.',
		});
	}

	run(message) {
		if (message.member.voice.channel) {
			message.member.voice.channel.join()
				.then(connection => {
					if (connection.dispatcher.paused) {
						// connection returns a VoiceConnection and dispatcher returns a StreamDispatcher
						connection.dispatcher.resume();
						setBotActivity(message, this.client);
					}
					else{
						const activityName = this.client.user.presence.activities[0].name;
						if (activityName != 'with Commando') {
							message.reply('Music is currently playing');
						}
						else{
							message.reply('No song is paused. Play a song instead.');
						}
					}
				});
		}
		else {
			message.reply('You need to join a voice channel first!');
		}
	}
};

// Function to read bot's activity (track playing before being paused) from mongodb and set it in discord
function setBotActivity(message, client) {
	// uses condition (server/guild id) to determine where to find bot data
	const condition = { _id: message.guild.id };

	// Using database Model ("Track" in this case) and not instance of the model,
	// method searches database using condition
	Track.find(condition)
		.then((result) => {
			// Types: PLAYING, WATCHING, LISTENING, STREAMING,
			client.user.setActivity(result[0].track, { type: 'PLAYING' });
		})
		.catch((err) => {
			console.log('Couldn\'t retrieve name of track from database\n', err);
		});
}