const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { verifyToken } = require("../utils/jwt");

const strictAuth = async function (req, res, next) {
	const token = req.cookies.token;
	if (!token) {
		return res.redirect("/login");
	}

	try {
		const decoded = verifyToken(token);
		const user = await User.findById(decoded.id);
		if (!user) {
			return res.redirect("/login");
		}
		req.user = user;
		next();
	} catch (err) {
		return res.redirect("/login");
	}
};

const optionalAuth = async function (req, res, next) {
	const token = req.cookies.token;
	if (!token) {
		req.user = null;
		return next();
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);
		req.user = user;
		next();
	} catch (err) {
		req.user = null;
		next();
	}
};

module.exports = { strictAuth, optionalAuth };
