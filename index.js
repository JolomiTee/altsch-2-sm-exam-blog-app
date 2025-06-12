const { connectToMongoDB } = require("./config/connectDb");
const PORT = process.env.PORT || 3000;
const app = require("./app");

app.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server active on port ${PORT}`);
});
