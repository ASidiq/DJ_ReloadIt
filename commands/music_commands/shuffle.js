const { Command } = require('discord.js-commando');
// imports database model into script
const Playlist = require('../../models/playlist.js');


module.exports = class ShufflePlaylist extends Command {
	constructor(client) {
		super(client, {
			name: 'shuffle',
			aliases: ['shuffle-music', 'shuffle-song', 'mix'],
			group: 'music_commands',
			memberName: 'shuffle',
			description: 'Shuffles the song in the playlist.',
		});
	}

	run(message) {
		// Voice only works in servers. If the message is not from inside
		// a server/guild we ignore it
		if (!message.guild) return;

		// checking if the sender is in a voice channel themselves
		if (message.member.voice.channel) {
			message.member.voice.channel.join()
			// connection returns a VoiceConnection
				.then(() => {
					// function to shuffle playlist and update the right playlist document in the db
					shufflePlaylist(message, this.client);
				});
		}
		else {
			message.reply('You need to join a voice channel first!');
		}
	}
};

// Fisher-Yates (aka Knuth) Shuffle algorithm
function shuffle(playlist) {
	let m = playlist.length, t, i;

	// While there remain elements to shuffle…
	while (m) {

		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = playlist[m];
		playlist[m] = playlist[i];
		playlist[i] = t;
	}

	return playlist;
}


function shufflePlaylist(message) {
	const id = message.guild.id;
	Playlist.findById(id, function(err, queue) {
		if (err) {
			// error to do with connecting to the database not finding ID
			console.log(err);
			return;
		}
		else if (queue === null) {
			message.reply('No playlist to shuffle');
			return;
		}
		else {
			console.table(queue.playlist);
			if (queue.playlist.length < 2) {
				return;
			}
			queue.playlist = shuffle(queue.playlist);
			// Because the content of the array is only being reshuffled, without markModified()
			// .save() does not save the updated document to the db.
			// This is because it does not observe any change to the actual values of the array.
			// markModfield() is used to reinforce that a change has occurred at a path
			// and the db should be updated accordingly
			queue.markModified('playlist');
			queue.save();
		}
	});
}