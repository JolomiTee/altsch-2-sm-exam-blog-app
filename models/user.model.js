const moogoose = require("mongoose");

//Define a schema
const Schema = moogoose.Schema;

//Define author schema
const UserSchema = new Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: false,
	},
	password: {
		type: String,
		required: false,
	},
	publishedBooks: {
		type: Array,
		default: [],
	},
});

// Export the model
module.exports = moogoose.model("User", UserSchema);