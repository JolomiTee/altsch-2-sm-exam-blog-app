const moogoose = require("mongoose");

//Define a schema
const Schema = moogoose.Schema;

//Define author schema
const userSchema = new Schema({
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

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.methods.comparePassword = function (inputPassword) {
	return bcrypt.compare(inputPassword, this.password);
};

// Export the model
module.exports = moogoose.model("User", userSchema);