describe("recoil:spring createGetSetHooks specs", () => {

	before(() => {
		cy.visitStory("creategetsethooks--simple");
	});

	it("should show the initial value", () => {

		cy.find("#testValue")
			.to.have("")
	});
});
