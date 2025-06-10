// Took inspuration from bookstore project

const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = require("./middleware/auth");

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { connectToMongoDB } = require("./config/connectDb");

const authRoutes = require("./routes/auth.route");
const blogRoutes = require("./routes/blog.route");
const viewRoutes = require("./routes/views.route");
const Blog = require("./models/blog.model");
const cookieParser = require("cookie-parser");
const PORT = 3000;
const app = express();

connectToMongoDB();

// basic middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

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

app.use(authMiddleware);

app.set("views", "views");
app.set("view engine", "ejs");

// routes go here

app.use("/", viewRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/blog", blogRoutes);


// Error handler middleware
app.use((err, req, res, next) => {
	console.log(err);
	const errorStatus = err.status || 500;
	res.status(errorStatus).send(err.message);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
