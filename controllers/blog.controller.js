const Blog = require("../models/blog.model");
const { calculateReadingTime } = require("../utils");

// done
const getAllBlogs = async (req, res) => {
	const blogs = await Blog.find({ state: "published" })
		.limit(5)
		.populate("author");
	res.render("blog/all-blogs", {
		title: "All Blogs",
		user: req.user,
		blogs,
	});
};

const getOwnBlogs = async (req, res) => {
	try {
		const blogs = await Blog.find({ author: req.user._id });
		res.render("blog/manage", { user: req.user, blogs });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// done
const getBlog = async (req, res) => {
	const { id } = req.params;
	try {
		const blog = await Blog.findById(id).populate(
			"author",
			"first_name last_name email"
		);

		if (!blog) {
			return res.status(404).send("Blog not found");
		}

		res.render("blog/blog", { user: req.user, blog });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// done
const createBlog = async (req, res) => {
	try {
		const { title, description, tags, body, state } = req.body;
		const reading_time = calculateReadingTime(body);

		const blog = await Blog.create({
			title,
			description,
			tags,
			body,
			reading_time,
			state,
			author: req.user._id,
		});
		res.redirect("/?create=success");
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};


const getEditableBlog = async (req, res) => {
	try {
		const blog = await Blog.findOne({
			_id: req.params.id,
			author: req.user._id,
		});

		if (!blog) {
			return res.status(404).send("Blog not found");
		}

		res.render("blog/edit", { user: req.user, blog });
	} catch (err) {
		res.status(500).send(err.message);
	}
};

const editBlog = async (req, res) => {
	try {
		const blog = await Blog.findOne({
			_id: req.params.id,
			author: req.user._id,
		});
		if (!blog) return res.status(404).json({ error: "Blog not found" });

		const allowedUpdates = ["title", "description", "tags", "body"];
		allowedUpdates.forEach((field) => {
			if (req.body[field] !== undefined) {
				blog[field] = req.body[field];
			}
		});

		if (req.body.body) {
			blog.reading_time = calculateReadingTime(req.body.body);
		}
		await blog.save();
		res.redirect("/api/v1/blog/my-blogs?message=edited");
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// done
const deleteBlog = async (req, res) => {
	try {
		const blog = await Blog.findOneAndDelete({
			_id: req.params.id,
			author: req.user._id,
		});
		if (!blog) return res.status(404).json({ error: "Blog not found" });

		res.redirect("/api/v1/blog/my-blogs?message=deleted");
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// done
const publishBlog = async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id);

		if (!blog) return res.status(404).send("Blog not found");
		if (blog.author.toString() !== req.user._id.toString())
			return res.status(403).send("Unauthorized");

		blog.state = "published";
		await blog.save();

		res.redirect("/api/v1/blog/my-blogs?message=published");
	} catch (err) {
		res.status(500).send(err.message);
	}
};

module.exports = {
	createBlog,
	editBlog,
	getEditableBlog,
	publishBlog,
	deleteBlog,
	getOwnBlogs,
	getAllBlogs,
	getBlog,
};
