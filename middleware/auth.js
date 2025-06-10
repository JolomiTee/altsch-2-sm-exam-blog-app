const jwt = require("jsonwebtoken");
const User = require("../models/user.model")

module.exports = async function (req, res, next) {
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
