const app = require("./app");
const { connectToMongoDB } = require("./config/connectDb");

const HOST = process.env.HOST || 3000;

app.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server active on port ${HOST}`);
});
