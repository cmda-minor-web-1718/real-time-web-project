const mongoose = require('mongoose');

const Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

const Room = new Schema({
	roomId: {
		type: String,
		isRequired: 'You need a roomId'
	},
	text: {
		type: String,
		default: '# welcome to the markdown editor'
	},
	members: Array,
});

module.exports = mongoose.model('Room', Room);
