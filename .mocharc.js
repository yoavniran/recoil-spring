module.exports = {
	require: ["@babel/register", "src/tests/test-setup.js"],
	// require: ["src/tests/test-setup.js"],
	spec: ["src/**/*.test.js"],
	timeout: 2200,
};
