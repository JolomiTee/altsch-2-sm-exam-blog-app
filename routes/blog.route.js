const express = require("express");
const {
	getBlog,
	createBlog,
	editBlog,
	deleteBlog,
} = require("../controllers/blog.controller");
const router = express.Router();

// 1. Create a blog

router.get("/create", (req, res) =>
	res.render("blog/create", { user: req.user })
);

router.post("/create", createBlog);

// 2. Get a blog

// router.get("/blog/:id", getBlog);

// router.post("/edit", editBlog);
// router.get("/delete", deleteBlog);

module.exports = router;
