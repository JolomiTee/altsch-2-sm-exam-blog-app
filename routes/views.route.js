const express = require("express");
const Blog = require("../models/blog.model");
const { logOut } = require("../controllers/auth.controller");
const router = express.Router();

router.get("/", async (req, res) => {
	const blogs = await Blog.find({ state: "published" })
		.limit(5)
		.populate("author");
	res.render("index", {
		title: "Home",
		user: req.user,
		blogs,
	});
});
router.get("/signup", (req, res) =>
	res.render("auth/signup", { user: req.user })
);
router.get("/login", (req, res) =>
	res.render("auth/login", { user: req.user })
);


// BLOGS

// router.get("/blog/:id", (req, res) =>
// 	res.render("blog/blog", { user: req.user })
// );


module.exports = router;

