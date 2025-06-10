const express = require("express");
const {
	getBlog,
	createBlog,
	editBlog,
	deleteBlog,
} = require("../controllers/blog.controller");
const router = express.Router();

router.get("/create", (req, res) =>
	res.render("blog/create", { user: req.user })
);

router.post("/create", createBlog);

router.get("/blog/:id", (req, res) =>
	res.render("blog/blog", { user: req.user })
);

// router.post("/edit", editBlog);
// router.get("/delete", deleteBlog);

module.exports = router;
