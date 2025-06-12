const User = require("../models/user.model");
const { verifyToken } = require("../utils/jwt");

module.exports = async function (req, res, next) {
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
