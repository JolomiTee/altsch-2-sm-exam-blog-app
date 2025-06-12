const app = require("./app");
const { connectToMongoDB } = require("./config/connectDb");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server active on port ${PORT}`);
});
