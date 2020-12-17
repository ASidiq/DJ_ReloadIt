const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the track collection
const trackSchema = new Schema({
	_id: {
		type: String,
		required: true,
	},
	track: {
		type: String,
		required: true,
	},
	// timestamps is optional.
	// It automatically generates and adds timestamps of when properties are created and updated
}, { timestamps: true });


// Connecting model to schema. Model allows us to use methods to retrieve and manipulate data in the database.
const Track = mongoose.model('Track', trackSchema);

// Allows modules to be used elsewhere in a project
module.exports = Track;