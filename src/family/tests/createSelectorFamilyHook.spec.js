import React from "react";
import createSpring from "../../spring";
import { springFamily } from "../../springTypes";
import { createSelectorFamilyHook } from "../createSelectorFamilyHook";

describe("createSelectorFamilyHook tests", () => {

	const getFileInfoComp = (useFile) => {
		const FileInfo = ({ id }) => {
			const [file] = useFile(id);

			console.log("FileInfo file - ", file);

			return file ?
				<>
					<div id="result-id">{id}</div>
					<div id="result-name">{file.name}</div>
				</> :
				<div id="no-result">File not found</div>;
		};
		return FileInfo;
	};

	it("should use atomFamily with default getter/setter", () => {
		const spring = createSpring({
			[springFamily("files")]: null,
		});

		const fileId = "aaa";
		const useFile = createSelectorFamilyHook(spring.atoms.files);
		const FileInfo = getFileInfoComp(useFile);

		const Test = () => {
			const setFile = useFile()[1];

			return <>
				<FileInfo id={fileId}/>

				<button id="btn-add-file" onClick={
					() => setFile(fileId, { name: "test.bat" })
				}>Add File
				</button>

			</>;
		};

		cy.mountSpringRoot(<Test/>, spring);

		cy.get("#no-result").should("be.visible");
		cy.get("#btn-add-file").click();
		cy.get("#result-id")
			.should("be.visible")
			.should("have.text", fileId);
		cy.get("#result-name").should("have.text", "test.bat");
	});

	it.only("should use atomFamily as getter and custom setter", () => {
		const spring = createSpring({
			[springFamily("files")]: null,
		});

		const fileId = "aaa";
		const useFile = createSelectorFamilyHook(
			spring.atoms.files,
			(id, file, { set, reset, get }) => {
				if (!file) {
					//remove
					reset(spring.atoms.files(id));
				} else {
					set(spring.atoms.files(id), file);
				}
			},
		);
		const FileInfo = getFileInfoComp(useFile);

		const Test = () => {
			const setFile = useFile()[1];

			return <>
				<FileInfo id={fileId}/>

				<button id="btn-add-file" onClick={
					() => setFile(fileId, { name: "test.bat" })
				}>Add File
				</button>
				<br/>
				<button id="btn-remove-file" onClick={
					() => setFile(fileId)
				}>Remove Files
				</button>
			</>;
		};

		cy.mountSpringRoot(<Test/>, spring);

		cy.get("#btn-add-file").click();
		cy.get("#result-id")
			.should("be.visible")
			.should("have.text", fileId);
		cy.get("#result-name").should("have.text", "test.bat");
		cy.get("#btn-remove-file").click();
		cy.get("#no-result").should("be.visible");
	});

	it("should use custom getter", () => {

	});

});
