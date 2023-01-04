
Cypress.Commands.add("visitStory", (storyName, {
    canvas = true,
} = {}) => {
    cy.log(`cmd.loadStory: story = ${storyName}`);

    const urlBase = canvas ?
		`iframe.html?id=` :
		`${Cypress.env("storybookPath")}`;

    const urlWithStory = `${urlBase}${storyName}`;

    cy.visit(urlWithStory);
});
