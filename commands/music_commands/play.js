const { Command } = require('discord.js-commando');
const ytdl = require('ytdl-core');
const Track = require(`${__basedir}/models/track.js`);


module.exports = class PlayMusic extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			aliases: ['play-music', 'play-song'],
			group: 'music_commands',
			memberName: 'play',
			description: 'Plays the music.',
			args: [
				{
					key: 'song',
					prompt: 'What music would you like the DJ to play? Provide the link.',
					type: 'string',
					default: 'https://www.youtube.com/watch?v=KCn8VmyObds&list=PLnY6yPJxU6f9zIRM5uj2aifo1YnROESgb&index=80&ab_channel=THEOSTENDMANPOPCORN%26SOUL',
					throttling: {
						usages: 3,
						duration: 60,
						// users will be limited to 3 songs per minute
					},
				},
			],
		});
	}

	run(message, { song }) {
		// Voice only works in servers. If the message is not from inside
		// a server we ignore it
		if (!message.guild) return;

		// Only try to join the sender's voice channel if they are in one
		// themselves
		if (message.member.voice.channel) {
			message.member.voice.channel.join()
			// connection returns a VoiceConnection
				.then(connection => {
					// play method returns a StreamDispatcher
					const dispatcher = connection.play(ytdl(song,
						{ filter: 'audioonly', quality: 'highestaudio' }));
					dispatcher.setVolume(0.1);
					// request to get music info from YouTube
					ytdl.getBasicInfo(song).then(info => {
						// Types: PLAYING, WATCHING, LISTENING, STREAMING,
						this.client.user.setActivity(info.videoDetails.title, { type: 'PLAYING' });
						// saves the title of the song in a file so it can be retrieved when the song is paused and then resumed again
						saveFile(message, info.videoDetails.title);
					});
				});
		}
		else {
			message.reply('You need to join a voice channel first!');
		}
	}
};

function saveFile(message, content) {
	const condition = { _id: message.guild.id };
	const update = { track: content };
	const options = { new: true, upsert: true, timestamps: true, runValidators:true };
	Track.findOneAndUpdate(condition, update, options, function(result, err) {
		if (err) {
			console.log(err);
		}
		else{
			console.log(result, '/n collection updated!');
		}
	});
}