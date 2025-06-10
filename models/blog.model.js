import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		description: {
			type: String,
			default: "",
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		state: {
			type: String,
			enum: ["draft", "published"],
			default: "draft",
		},
		read_count: {
			type: Number,
			default: 0,
		},
		reading_time: {
			type: String, // e.g., "4 mins"
		},
		tags: {
			type: [String],
			default: [],
		},
		body: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
