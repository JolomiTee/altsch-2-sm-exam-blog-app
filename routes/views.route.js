const express = require("express");
const Blog = require("../models/blog.model");
const { getAllBlogs } = require("../controllers/blog.controller");
const router = express.Router();

router.get("/", async (req, res) => {
	const blogs = await Blog.find({ state: "published" })
		.limit(10)
		.populate("author", "-password -__v -publishedBooks");

	res.status(200).json({
		title: "Home",
		description: "Returned the first 10 blogs only",
		loggedInAs:
			{
				full_name: `${req.user.first_name} ${req.user.last_name}`,
				email_address: req.user.email_address,
			} || "No logged in user",
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

