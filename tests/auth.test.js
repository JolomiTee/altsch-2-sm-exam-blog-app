const request = require("supertest");
const app = require("../app");
const { connect, closeDatabase, clearDatabase } = require("./index");

beforeAll(async () => await connect());
afterAll(async () => await closeDatabase());

describe("Auth API", () => {
	it("should signup user", async () => {
		const res = await request(app).post("/api/v1/auth/signup").send({
			first_name: "John",
			last_name: "Doe",
			email_address: "john@example.com",
			password: "password123",
		});

		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty("token");
		expect(res.body).toHaveProperty("message", "New user created");
	});

	it("should prevent duplicate signup", async () => {
		await request(app).post("/api/v1/auth/signup").send({
			first_name: "John",
			last_name: "Doe",
			email_address: "john@example.com",
			password: "password123",
		});

		const res = await request(app).post("/api/v1/auth/signup").send({
			first_name: "John",
			last_name: "Doe",
			email_address: "john@example.com",
			password: "password123",
		});

		expect(res.statusCode).toBe(400);
	});

	it("should login user", async () => {
		await request(app).post("/api/v1/auth/signup").send({
			first_name: "Jane",
			last_name: "Doe",
			email_address: "jane@example.com",
			password: "password123",
		});

		const res = await request(app).post("/api/v1/auth/login").send({
			email_address: "jane@example.com",
			password: "password123",
		});

		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty("token");
	});
});
