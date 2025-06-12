const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const { calculateReadingTime } = require("../utils");

// done
const getAllBlogs = async (req, res) => {
	try {
		// Query params
		const {
			page = 1,
			limit = 20,
			search = "",
			sort_by = "createdAt", // default sort by timestamp
			order = "desc",
		} = req.query;

		// establish that the query should only get published blogs because drafts shouldnt be accessible to everyone
		let query = { state: "published" }; // default: only published blogs

		// since we should be abel to search by author, title, tag
		let authorIds = [];
		if (search) {
			// First search authors
			const authors = await User.find({
				$or: [
					{ first_name: { $regex: search, $options: "i" } },
					{ last_name: { $regex: search, $options: "i" } },
				],
			});

			authorIds = authors.map((author) => author._id);

			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				//i cant use this since the author returns an id not an object { author: { $regex: search, $options: "i" } }, so instead i can search for the author first and pass to an array
				{ author: { $in: authorIds } },
				{ tags: { $regex: search, $options: "i" } },
			];
		}

		// Sorting logic
		const sortOptions = {};
		sortOptions[sort_by] = order === "asc" ? 1 : -1;

		// Query DB
		const blogs = await Blog.find(query)
			.populate("author", "-password") // exclude password
			.sort(sortOptions)
			.skip((page - 1) * limit)
			.limit(Number(limit));

		// Total count for pagination
		const total = await Blog.countDocuments(query);

		//? If testing with views
		// res.render("blog/all-blogs", {
		// 	title: "All Blogs",
		// 	user: req.user,
		// 	blogs,
		// 	totalPages: Math.ceil(total / limit),
		// 	currentPage: Number(page),
		// 	search,
		// 	sort_by,
		// 	order,
		// });

		//? Postman
		res.status(200).json({
			title: "All Blogs",
			description:
				"Returned the first 20 blogs while being paginated so that you can get the next 20 blogs when you increment the current page parameter",
			loggedInAs:
				{
					full_name: `${req.user.first_name} ${req.user.last_name}`,
					email_address: req.user.email_address,
				} || "No logged in user",
			blogs,
			totalPages: Math.ceil(total / limit),
			currentPage: Number(page),
			search,
			sort_by,
			order,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// done
const getOwnBlogs = async (req, res) => {
	try {
		const {
			page = 1,
			limit = 20,
			search = "",
			state = "",
			sort_by = "createdAt",
			order = "desc",
		} = req.query;

		// Start with filtering by current user since thats the basis of this route
		let query = { author: req.user._id };

		// the state should normally return both the published and drafts, but if FileSystemDirectoryReader, then it should return the matched state
		if (state) {
			query.state = state;
		}

		// then match serches for tags or titles
		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ tags: { $regex: search, $options: "i" } },
			];
		}

		const sortOptions = {};
		sortOptions[sort_by] = order === "asc" ? 1 : -1;

		const blogs = await Blog.find(query)
			.sort(sortOptions)
			.skip((page - 1) * limit)
			.limit(Number(limit));

		const total = await Blog.countDocuments(query);

		// res.render("blog/manage", {
		// {fields}
		// });

		//? Postman
		res.status(200).json({
			title: "All Blogs",
			description:
				"Returned the first 20 blogs while being paginated so that you can get the next 20 blogs when you increment the current page parameter",
			loggedInAs:
				{
					full_name: `${req.user.first_name} ${req.user.last_name}`,
					email_address: req.user.email_address,
				} || "No logged in user",
			blogs,
			totalPages: Math.ceil(total / limit),
			currentPage: Number(page),
			search,
			sort_by,
			order,
		});
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
			"first_name last_name email_address"
		);

		if (!blog) {
			return res.status(404).send("Blog not found");
		}

		// i think the blog read count can only increase if this route is hit by users and it has to be a published blog else drafts would have views
		if (blog.state === "published") {
			blog.read_count += 1;
			await blog.save();
		}

		// res.render("blog/blog", { user: req.user, blog });
		res.status(200).json(blog);
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
		// res.redirect("/?create=success");

		res.status(201).json({
			message: "New blog created",
			blog,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// done
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

// done
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
		// res.redirect("/api/v1/blog/my-blogs?message=edited");

		res.status(200).json({
			message: "Blog updated successfully",
			blog,
		});
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

		// res.redirect("/api/v1/blog/my-blogs?message=deleted");
		res.status(200).json({
			message: "Blog deleted",
			blog,
		});
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

		// res.redirect("/api/v1/blog/my-blogs?message=published");
		res.status(200).json({
			message: "Congratulations, Blog has been published",
			blog,
		});
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
