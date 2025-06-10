const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt");


const signUp = async (req, res) => {
	const { first_name, last_name, email, password } = req.body;
	try {
		const existing = await User.findOne({ email });
		if (existing) return res.status(400).send("User already exists");

		const user = await User.create({
			first_name,
			last_name,
			email,
			password,
		});
		const token = generateToken(user);
		res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
		res.redirect("/", {
			message: "Signup successful",
			user: req.user,
		});
	} catch (err) {
		res.status(500).send(err.message);
	}
};


const logIn = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user || !(await user.comparePassword(password)))
			return res.status(401).send("Invalid credentials");

		const token = generateToken(user);
		res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
		res.redirect("/", {
			message: "login successful",
			user: req.user,
		});
	} catch (err) {
		res.status(500).send(err.message);
	}
};


const logOut = async (req, res) => {
	res.clearCookie("token");
	res.redirect("/");
};

module.exports = {logIn, logOut, signUp}