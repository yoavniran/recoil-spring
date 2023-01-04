const path = require("path");
// const webpack = require("webpack");

module.exports = {
  port: 8049,
  chromeWebSecurity: false,
  video: false,

  env: {
    storybookPath: "/?path=/story/",
  },

  // "pluginsFile": false,
  component: {
    specPattern: "**/*.spec.js",
    viewportHeight: 764,
    viewportWidth: 920,
    devServer: {
      framework: "react",
      bundler: "webpack",
      // webpackConfig: require('./webpack.config'),
      webpackConfig: async () => {
        // 	// ... do things ...
        // 	const modifiedConfig = await injectCustomConfig(baseConfig)
        // 	return modifiedConfig
        return {
          mode: "development",
          entry: [path.join(__dirname, "src", "index.js")],
          output: {
            path: path.resolve(__dirname, "wp-dist"),
          },
          module: {
            rules: [
              {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                  },
                },
              },
            ],
          },
        };
      },
    },
  },

  e2e: {
	  specPattern: "cypress/integration/**/*.spec.js",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
