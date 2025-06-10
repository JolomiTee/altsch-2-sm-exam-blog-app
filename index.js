// Took inspuration from bookstore project

const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const {connectToMongoDB} = require("./config/connectDb");
const { default: Blog } = require("./models/blog.model");

const PORT = 3000;
const app = express();

connectToMongoDB();

// basic middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);

// security middleware
app.use(helmet());
app.use(cors());

app.use(express.static("public"));
app.use(express.json());

app.set("views", "views");
app.set("view engine", "ejs");

// routes go here
app.get("/", async (req, res) => {
	const blogs = await Blog.find({ state: "published" })
		.limit(5)
		.populate("author");
	res.render("index", {
		title: "Home",
		user: req.user || "Jolomi",
		blogs: [],
	});
});


// Error handler middleware
app.use((err, req, res, next) => {
	console.log(err);
	const errorStatus = err.status || 500;
	res.status(errorStatus).send(err.message);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
