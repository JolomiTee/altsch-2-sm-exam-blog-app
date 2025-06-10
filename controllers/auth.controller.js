const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt");


const signUp = async (req, res) => {
	const { first_name, last_name, email_address, password } = req.body;

	try {
		const existing = await User.findOne({ email_address });
		if (existing)
			return res.status(400).json({ message: "User already exists" });

		const user = await User.create({
			first_name,
			last_name,
			email_address,
			password, // Make sure this is hashed in a pre-save hook or manually
		});

		const token = generateToken(user);

		res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

		res.redirect("/?signup=success");
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const logIn = async (req, res) => {
	const { email_address, password } = req.body;
	try {
		const user = await User.findOne({ email_address });
		if (!user || !(await user.comparePassword(password)))
			return res.status(401).send("Invalid credentials");

		const token = generateToken(user);
		res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
		res.redirect("/?login=success");
	} catch (err) {
		res.status(500).send(err.message);
	}
};

const logOut = async (req, res) => {
	res.clearCookie("token");
	res.redirect("/?logout=true");
};

module.exports = {logIn, logOut, signUp}