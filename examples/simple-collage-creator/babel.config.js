module.exports = {
	presets: [
		"@babel/env",
		["@babel/preset-react", {
			"runtime": "automatic",
		}],
	],
	plugins: [
		// "@babel/plugin-transform-runtime",
		"@babel/plugin-proposal-export-default-from",
		[
			"babel-plugin-styled-components",
			{
				"displayName": true
			}
		]
	],
};
