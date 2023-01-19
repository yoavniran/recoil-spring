const yargs = require("yargs"),
	ts = require("typescript"),
	path = require("path"),
	fs = require("fs"),
	tsConfig = require("../types/tsconfig.json");

const ROOT_DEF = yargs.argv.in;
const ROOT_DIR = path.dirname(ROOT_DEF);
const OUT_PATH = path.resolve(yargs.argv.out);
const OUT_DIR = path.dirname(OUT_PATH);

const compilerOptions = {
	...tsConfig.compilerOptions,
	noEmitOnError: true,
	declaration: true,
	// maxNodeModuleJsDepth: 10,
	moduleResolution:
		ts.getEmitModuleResolutionKind(tsConfig.compilerOptions.moduleResolution || "node"),
	module:
		ts.getEmitModuleKind(tsConfig.compilerOptions.module || "commonjs"),
};

const getFileContents = (file) => {
	let code = `\n\n// -- ${path.basename(file.path)}`;
	const extImports = [];

	const readNode = (node) => {
		//we extract the imports from the file's code so they can be hoisted to the top of the generated file
		if (node.kind === ts.SyntaxKind.ImportDeclaration) {
			//take only external imports
			if (!node.moduleSpecifier.text.startsWith(".")) {
				extImports.push(node);
			}
		} else {
			code += file.text.slice(node.pos, node.end);
		}
	};

	ts.forEachChild(file, readNode);

	return { file, code, extImports };
};

const collectImportsContent = (index, tsProgram) => {
	return index.imports.map((imported) => {
		//imported files must be *.d.ts files
		const importedPath = path.join(ROOT_DIR, imported.text + ".d.ts");
		const importedFile = tsProgram.getSourceFile(importedPath);

		return getFileContents(importedFile);
	});
};

const getUnifiedImports = (contents) => {
	const imports = {};

	contents.forEach(({ file, extImports }) => {
		extImports.forEach((node) => {
			const libName = node.moduleSpecifier.text;
			const libImports = imports[libName] ||= [];

			const importClause = file.text.slice(node.importClause.pos, node.importClause.end);
			const importedItems = importClause.replaceAll(/{|}|\n|\t|\s/g, "").split(",");

			importedItems
				.filter(Boolean)
				.forEach((item) => {
					if (!libImports.includes(item)) {
						libImports.push(item);
					}
				});
		});
	});

	return Object.entries(imports).reduce((res, [lib, imported]) => {
		return res + `\n import { ${imported.join(", ")} } from "${lib}"`;
	}, "");
};

const writeContentsToFile = (contents) =>
	new Promise((resolve, reject) => {
		console.log(`✍️ Writing to file: ${OUT_PATH}`);
		const outputStream = fs.createWriteStream(OUT_PATH);

		outputStream.on("finish", () => {
			console.log(`🏁 Done writing to: ${OUT_PATH}`);
			resolve();
		});

		outputStream.on("error", (err) => {
			console.error("💥 Writing failed with error: ", err);
			reject(err);
		});

		try {
			const imports = getUnifiedImports(contents);
			//"hoisting" import statements to the top of the new file
			outputStream.write(imports);
			contents.forEach(({ code }) => outputStream.write(code));
		} catch (ex) {
			console.error("💥 Generate FAILED ! ", ex);
			reject(ex);
		} finally {
			outputStream.end();
		}
	});

const checkResult = () => {
	console.log("🔬 Testing resulting file.");
	const program = ts.createProgram([OUT_PATH], {
		strict: true,
		noEmitOnError: true,
		moduleResolution: ts.ModuleResolutionKind.Node16,
		module: ts.ModuleKind.ES2015,
		"noImplicitAny": true,
		"strictNullChecks": true,
	});
	const emitResult = program.emit();

	if (emitResult.emitSkipped) {
		console.log("❗️ Found Errors in resulting file");

		emitResult.diagnostics.forEach((d) => {
			if (d.file) {
				const { line, character } = ts.getLineAndCharacterOfPosition(d.file, d.start);
				console.log(`[${line + 1},${character + 1}]: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`);
			} else {
				console.log(ts.flattenDiagnosticMessageText(d.messageText, "\n"));
			}
		});
	} else {
		console.log("✅ No errors found in resulting file 🤘");
	}
};

const generate = async () => {
	const program = ts.createProgram([ROOT_DEF], compilerOptions);
	const index = program.getSourceFile(ROOT_DEF);

	if (!fs.existsSync(OUT_DIR)) {
		fs.mkdirSync(OUT_DIR, { recursive: true });
	}

	const contents = collectImportsContent(index, program);
	await writeContentsToFile(contents);

	checkResult();
};

generate();
