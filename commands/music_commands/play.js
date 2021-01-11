const { Command } = require('discord.js-commando');
const ytdl = require('ytdl-core');
// imports database model into script
const Track = require('../../models/track.js');
const Playlist = require('../../models/playlist.js');


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
					// function plays song
					songPlayer(connection, message, song, this.client);
				});
		}
		else {
			message.reply('You need to join a voice channel first!');
		}
	}
};

// Function stores bot activity
function storeBotActivity(message, content) {
	// uses condition (server/guild id) to determine where to store bot activity
	const condition = { _id: message.guild.id };

	// update activity with content
	const update = { track: content };

	// options to pass to method
	const options = { new: true, upsert: true, timestamps: true, runValidators:true };

	// Using database Model ("Track" in this case) and not instance of the model,
	// method searches database using condition and update data. if not adds it to db.
	Track.findOneAndUpdate(condition, update, options, function(result, err) {
		if (err) {
			console.log(err);
		}
		else{
			// console.log(result, '/n collection updated!');
		}
	});
}

function songPlayer(connection, message, song, client) {
	// '.play' method returns a StreamDispatcher
	const dispatcher = connection.play(ytdl(song,
		{ filter: 'audioonly', quality: 'highestaudio' }));
	dispatcher.setVolume(0.1);
	// request to get music info from YouTube
	ytdl.getBasicInfo(song).then(info => {
		// Types: PLAYING, WATCHING, LISTENING, STREAMING,
		client.user.setActivity(info.videoDetails.title, { type: 'PLAYING' });
		// saves the title of the song in a mongodb database so it can be retrieved when the song is paused and then resumed again
		storeBotActivity(message, info.videoDetails.title);
	});
	dispatcher.on('finish', () => {
		// When a song finishes playing 'playQueue' checks for songs queued in the database and plays it
		playQueue(connection, message, client);
	});
}

function playQueue(connection, message, client) {
	const id = message.guild.id;
	Playlist.findById(id, function(err, queue) {
		if (err) {
			// error to do with connecting to the database not finding ID
			console.log(err);
			return;
		}
		else if (queue === null) {
			client.user.setActivity('with Commando');
			return;
		}
		else {
			const newSong = queue.playlist.shift();
			if(newSong === undefined) {
				client.user.setActivity('with Commando');
				return;
			}
			queue.save();
			// plays next song in the queue from the database
			songPlayer(connection, message, newSong, client);
		}
	});
}

