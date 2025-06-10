const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
	return jwt.sign(
		{ id: user._id, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN }
	);
};

exports.verifyToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET);
};
