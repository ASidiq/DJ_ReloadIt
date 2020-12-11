const { Command } = require('discord.js-commando');
const fs = require('fs');

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
						// Types: PLAYING, WATCHING, LISTENING, STREAMING,
						this.client.user.setActivity(readSongFile(), { type: 'PLAYING' });
					}
					else{
						message.reply('No song is paused. Play a song instead.');
					}
				});
		}
		else {
			message.reply('You need to join a voice channel first!');
		}
	}
};

// Function to read the song_file.json to get title of paused music
function readSongFile() {
	const data = fs.readFileSync('C:/Users/ASidiq_ph1/Desktop/Personal Learning/DJ_ReloadIt/song_file.json', 'utf8');
	// parse JSON string to object
	const songTitle = JSON.parse(data);

	// return title
	return songTitle.title;
}