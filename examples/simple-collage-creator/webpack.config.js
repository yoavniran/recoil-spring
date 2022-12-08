const path = require("path"),
	webpack = require("webpack"),
	MiniCssExtractPlugin = require("mini-css-extract-plugin"),
	ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	WatchExternalFilesPlugin = require("webpack-watch-files-plugin").default,
	WebpackShellPlugin = require("webpack-shell-plugin-next");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
	mode: isDev ? "development" : "production",
	entry: {
		app: "./src/index.jsx",
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	devtool: isDev ? "inline-source-map" : "source-map",
	devServer: {
		static: "./dist",
		hot: true,
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				include: [
					path.resolve(__dirname, "src"),
					/recoil-spring/
				],
				// exclude: /node_modules/,
				use: [
					{
						loader: require.resolve("babel-loader"),
						options: {
							plugins: [isDev && require.resolve("react-refresh/babel")].filter(Boolean),
						},
					},
				],
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "/"
						}
					}
				]
			},
			{
				test: /\.css$/i,
				use: [
					isDev ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader",
					// "postcss-loader",
					// "sass-loader",
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js", ".tsx", ".jsx"],
		alias: {
			"recoil": path.resolve(__dirname, "node_modules/recoil/es"),
			"react": path.resolve(__dirname, "node_modules/react"),
			"react-dom": path.resolve(__dirname, "node_modules/react-dom"),
		},
	},
	plugins: [
		...[
			//rebuild when recoil-spring changes
			isDev && new WatchExternalFilesPlugin({
				files: [
					"../../src/**/*.js"
				]
			}),
			//reinstall local version of recoil-spring on each build
			isDev && new WebpackShellPlugin({
				onBuildStart:{
					scripts: ["pnpm add ../../"],
					blocking: true,
				},
			}),
			isDev && new webpack.HotModuleReplacementPlugin(),
			isDev && new ReactRefreshWebpackPlugin(),
			!isDev && new MiniCssExtractPlugin()
		].filter(Boolean),
		new HtmlWebpackPlugin({
			template: "public/index.html"
		}),
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
	},
};
