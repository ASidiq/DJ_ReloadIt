const { Command } = require('discord.js-commando');
const play = require('./play.js');
// imports database model into script
const Playlist = require('../../models/playlist.js');


module.exports = class SkipSong extends Command {
	constructor(client) {
		super(client, {
			name: 'skip',
			aliases: ['skip-music', 'skip-song'],
			group: 'music_commands',
			memberName: 'skip',
			description: 'Skips the song that is currently playing.',
		});
	}

	run(message) {
		// Voice only works in servers. If the message is not from inside
		// a server/guild we ignore it
		if (!message.guild) return;

		// checks if member using command is in a voice channel
		if (message.member.voice.channel) {
			// stores current name of bot's activity
			const activityName = this.client.user.presence.activities[0].name;
			// if bot's activity is not the text below, then it is either playing music or paused
			if (activityName != 'with Commando') {
				this.findSong(message, this.client);
			}
			else {
				message.reply('A song needs to be playing or paused to skip track');
			}
		}
		else {
			message.reply('You need to join a voice channel first!');
		}
	}

	findSong(message, client) {
		const id = message.guild.id;
		Playlist.findById(id, function(err, queue) {
			if (err) {
				// error to do with connecting to the database not finding ID
				console.log(err);
				return;
			}
			else if (queue === null) {
				message.reply('No song queued');
				return;
			}
			else if (queue.playlist.length < 1) {
				message.reply('End of playlist reached');
				return;
			}
			else {
				const track = queue.playlist.shift();
				queue.save();
				if (track != null && track != undefined) {
					const playNextSong = new play(client);
					playNextSong.run(message, { song:track });
				}
			}
		});
	}
};