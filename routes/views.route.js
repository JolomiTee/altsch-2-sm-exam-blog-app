const express = require("express");
const Blog = require("../models/blog.model");
const { getAllBlogs } = require("../controllers/blog.controller");
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

// AUTH
router.get("/signup", (req, res) =>
	res.render("auth/signup", { user: req.user })
);
router.get("/login", (req, res) =>
	res.render("auth/login", { user: req.user })
);

router.get("/all", getAllBlogs);



module.exports = router;

