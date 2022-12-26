module.exports = {
	require: "@babel/register",
	file: ["src/tests/test-setup.js"],
	spec: ["src/**/*.test.js"],
	timeout: 2200,
};
