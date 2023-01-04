describe("recoil:spring useStateHistory specs", () => {
	beforeEach(() => {
		cy.visitStory("history--simple");
	});

	it("should go back and forward in history only for included atoms", () => {
		cy.get("#history-back").should("be.disabled");
		cy.get("#history-forward").should("be.disabled");

		cy.get("#age-field")
			.type("5");

		cy.get("#name-field")
			.type("bob");

		cy.get("#color-field")
			.click({ x: 35, y: 35 });

		cy.get("#history-back").click();

		cy.get("#name-field").should("have.value", "bo");
		cy.get("#age-field").should("have.value", "05");
		cy.get("#color-value").should("have.text", "#c8a5a5");

		cy.get("#history-back")
			.click()
			.click()
			.click();

		cy.get("#history-back").should("be.disabled");

		cy.get("#name-field").should("have.value", "");
		cy.get("#age-field").should("have.value", "0");
		cy.get("#color-value").should("have.text", "#c8a5a5");

		cy.get("#history-forward")
			.click()
			.click();

		cy.get("#name-field").should("have.value", "b");
		cy.get("#age-field").should("have.value", "5");

		cy.get("#history-back").should("not.be.disabled");
		cy.get("#history-forward").should("not.be.disabled");
	});

	it("should clear forward history on new entry", () => {
		cy.get("#history-back").should("be.disabled");
		cy.get("#history-forward").should("be.disabled");

		cy.get("#age-field")
			.type("5");

		cy.get("#name-field")
			.type("bob");

		cy.get("#history-back")
			.click();

		cy.get("#history-forward").should("not.be.disabled");

		cy.get("#name-field")
			.type("b");

		cy.get("#history-forward").should("be.disabled");

		cy.get("#history-back")
			.click();

		cy.get("#name-field").should("have.value", "bo");

		cy.get("#color-field")
			.click({ x: 35, y: 35 });

		cy.get("#history-forward")
			.should("not.be.disabled")
			.click();

		cy.get("#name-field").should("have.value", "bob");
		cy.get("#color-value").should("have.text", "#c8a5a5");

		cy.get("#history-forward").should("be.disabled")
	});
});
