const Blog = require("../models/blog.model");
const { calculateReadingTime } = require("../utils");
const { generateToken } = require("../utils/jwt");


const getOwnBlogs = async (req, res) => {
		try {
			const blogs = await Blog.find({ author: req.user._id });
			res.json(blogs);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
}

const getBlog = async (req, res) => {
		try {
			const blogs = await Blog.find({ _id: req.blog._id });
			res.json(blogs);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
}


const createBlog = async (req, res) => {
	try {
		const { title, description, tags, body } = req.body;
		const reading_time = calculateReadingTime(body);

		const blog = await Blog.create({
			title,
			description,
			tags,
			body,
			reading_time,
			author: req.user._id,
		});
		res.redirect("/?create=success");

	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const editBlog = async (req, res) => {
	try {
		const blog = await Blog.findOne({
			_id: req.params.id,
			author: req.user._id,
		});
		if (!blog) return res.status(404).json({ error: "Blog not found" });

		Object.assign(blog, req.body);
		if (req.body.body) {
			blog.reading_time = calculateReadingTime(req.body.body);
		}
		await blog.save();
		res.json({ message: "Blog updated", blog });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

const deleteBlog = async (req, res) => {
	try {
		const blog = await Blog.findOneAndDelete({
			_id: req.params.id,
			author: req.user._id,
		});
		if (!blog) return res.status(404).json({ error: "Blog not found" });

		res.json({ message: "Blog deleted" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

const publishBlog = async (req, res) => {
	try {
		const blog = await Blog.findOne({
			_id: req.params.id,
			author: req.user._id,
		});
		if (!blog) return res.status(404).json({ error: "Blog not found" });

		blog.state = "published";
		await blog.save();
		res.json({ message: "Blog published", blog });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}
module.exports = {createBlog, editBlog, publishBlog, deleteBlog, getOwnBlogs, getBlog}