const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the track collection
const playlistSchema = new Schema({
	_id: {
		type: String,
		required: true,
	},
	playlist: {
		type: Array,
		required: true,
	},
	// timestamps is optional.
	// It automatically generates and adds timestamps of when properties are created and updated
}, { timestamps: true });


// Connecting model to schema. Model allows us to use methods to retrieve and manipulate data in the database.
const Playlist = mongoose.model('Playlist', playlistSchema);

// Allows modules to be used elsewhere in a project
module.exports = Playlist;