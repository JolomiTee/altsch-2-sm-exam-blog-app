const express = require("express");
const {
	getBlog,
	getOwnBlogs,
	createBlog,
	editBlog,
	deleteBlog,
	publishBlog,
} = require("../controllers/blog.controller");
const router = express.Router();

// 1. Create a blog
router.get("/create", (req, res) =>
	res.render("blog/create", { user: req.user })
);
router.post("/create", createBlog);

// 2. Get blogs
router.get("/my-blogs", getOwnBlogs);

router.get("/:id", getBlog);
router.put("/:id", editBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id", publishBlog);


// router.post("/edit", editBlog);
// router.get("/delete", deleteBlog);

module.exports = router;
