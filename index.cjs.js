if (process.env.NODE_ENV === "production") {
	module.exports = require("./lib/cjs/index.min.js");
} else {
	module.exports = require("./lib/cjs/index.js");
}
