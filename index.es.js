if (process.env.NODE_ENV === "production") {
	module.exports = require("./lib/es/index.min.js");
} else {
	module.exports = require("./lib/es/index.js");
}
