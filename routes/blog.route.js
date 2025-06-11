const express = require("express");
const {
	getBlog,
	getOwnBlogs,
	createBlog,
	editBlog,
	getEditableBlog,
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

// 6. Get blog
router.get("/:id", getBlog);

// 3. Publish blog
router.post("/:id/publish", publishBlog);

// 4. Edit blog
router.get("/:id/edit", getEditableBlog);

router.post("/:id/edit", editBlog);

// 5. Delete blog
router.post("/:id/delete", deleteBlog);

module.exports = router;
