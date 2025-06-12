const request = require("supertest");
const app = require("../app");
const { connect, closeDatabase, clearDatabase } = require("./index");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

let token, userId;

beforeAll(async () => {
	await connect();

	const user = await User.create({
		first_name: "Jane",
		last_name: "Doe",
		email_address: "jane@example.com",
		password: "password123",
	});
	userId = user._id;

	token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});
});

afterAll(async () => await closeDatabase());

describe("Blog API", () => {
	let blogId;

	it("should create a blog", async () => {
		const res = await request(app)
			.post("/api/v1/blog/create")
			.set("Cookie", [`token=${token}`])
			.send({
				title: "Test Blog",
				description: "Test Description",
				tags: ["tag1", "tag2"],
				body: "Blog body",
			});

		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty("blog");
		blogId = res.body.blog._id;
	});

	it("should edit a blog", async () => {
		const create = await request(app)
			.post("/api/v1/blog/create")
			.set("Cookie", [`token=${token}`])
			.send({
				title: "Blog to Edit",
				description: "Desc",
				tags: ["tag"],
				body: "Body",
			});

		blogId = create.body.blog._id;

		const res = await request(app)
			.post(`/api/v1/blog/${blogId}/edit`)
			.set("Cookie", [`token=${token}`])
			.send({
				title: "Updated Blog",
				description: "Updated Desc",
				tags: ["updated"],
				body: "Updated Body",
			});

		expect(res.statusCode).toBe(200);
		expect(res.body.blog.title).toBe("Updated Blog");
	});

	it("should publish a blog", async () => {
		const create = await request(app)
			.post("/api/v1/blog/create")
			.set("Cookie", [`token=${token}`])
			.send({
				title: "To Publish",
				description: "Desc",
				tags: ["tag"],
				body: "Body",
			});

		blogId = create.body.blog._id;

		const res = await request(app)
			.post(`/api/v1/blog/${blogId}/publish`)
			.set("Cookie", [`token=${token}`]);

		expect(res.statusCode).toBe(200);
		expect(res.body.blog.state).toBe("published");
	});

	it("should delete a blog", async () => {
		const create = await request(app)
			.post("/api/v1/blog/create")
			.set("Cookie", [`token=${token}`])
			.send({
				title: "To Delete",
				description: "Desc",
				tags: ["tag"],
				body: "Body",
			});

		blogId = create.body.blog._id;

		const res = await request(app)
			.post(`/api/v1/blog/${blogId}/delete`)
			.set("Cookie", [`token=${token}`]);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("message", "Blog deleted");
	});
});
