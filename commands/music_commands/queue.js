const { Command } = require('discord.js-commando');
const Playlist = require(`${__basedir}/models/playlist.js`);

module.exports = class QueueMusic extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			aliases: ['queue-music', 'include', 'add'],
			group: 'music_commands',
			memberName: 'queue',
			description: 'Queues music in a playlist.',
			args: [
				{
					key: 'song',
					prompt: 'What music would you like the DJ to add to the playlist? Provide the link.',
					type: 'string',
					default: 'https://www.youtube.com/watch?v=KCn8VmyObds&list=PLnY6yPJxU6f9zIRM5uj2aifo1YnROESgb&index=80&ab_channel=THEOSTENDMANPOPCORN%26SOUL',
					throttling: {
						usages: 3,
						duration: 60,
						// users will be limited to 3 songs per minute to add to the playlist
					},
				},
			],
		});
	}

	run(message, { song }) {
		// stores of server/guild id (server id/guild id)
		const id = message.guild.id;

		// Using database Model ("Playlist" in this case) and not instance of the model,
		// uses id to search and find the playlist for a specific server/guild in the database
		Playlist.findById(id, function(err, queue) {
			if (err) {
				console.log(err);
			}
			else if (queue === null) {
				const newPlaylist = new Playlist({
					_id: id.toString(),
					playlist: [song],
				});
				newPlaylist.save();
			}
			else {
				queue.playlist.push(song);
				queue.save();
			}
		});
	}
};