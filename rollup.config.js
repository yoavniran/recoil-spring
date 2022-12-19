import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

const ENTRY = "src/index.js",
	DEST = "lib";

const filterEmpty = (a) => a.filter(Boolean);

const createTask = (format, isDev = false) => ({
	input: ENTRY,
	output: {
		file: `${DEST}/${format}/index${isDev ? "" : ".min"}.js`,
		format,
	},
	plugins: filterEmpty([
		nodeResolve(),
		babel({ babelHelpers: "bundled" }),
		!isDev && terser()
	]),
	external: [
		/node_modules/
	]
});

export default [
	createTask("cjs", false),
	createTask("cjs", true),
	createTask("es", false),
	createTask("es", true),
];
