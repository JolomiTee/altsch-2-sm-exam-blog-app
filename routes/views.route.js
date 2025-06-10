const express = require("express");
const router = express.Router();

router.get("/", (req, res) =>
	// const blogs = await Blog.find({ state: "published" })
	// 	.limit(5)
	// 	.populate("author");
	res.render("index", {
		title: "Home",
		user: req.user,
		blogs: [],
	})
);
router.get("/signup", (req, res) =>
	res.render("auth/signup", { user: req.user })
);
router.get("/login", (req, res) =>
	res.render("auth/login", { user: req.user })
);

module.exports = router;

