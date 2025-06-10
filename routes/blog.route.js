const express = require("express");
const router = express.Router();


router.get("/blog/:id", (req, res) =>
	res.render("blog/blog", { user: req.user })
);

// router.post("/create", createBlog);
// router.post("/edit", editBlog);
// router.get("/delete", deleteBlog);

module.exports = router;
