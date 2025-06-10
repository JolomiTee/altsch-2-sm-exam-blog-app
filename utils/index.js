
function calculateReadingTime(text) {
	const wordsPerMinute = 200;
	const words = text.trim().split(/\s+/).length;
	const time = Math.ceil(words / wordsPerMinute);
	return `${time} min read`;
};


module.exports = {calculateReadingTime}