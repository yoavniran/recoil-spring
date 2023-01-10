import React from "react";
import "./commands";
import { mount } from "cypress/react18";
import SpringRoot from "../../src/SpringRoot";

// Ensure global styles are loaded
// import "../../src/index.css";

Cypress.Commands.add("mount", mount);

const TestContainer = ({ children, ...rootProps }) => {
	return <SpringRoot {...rootProps}>
		{children}
	</SpringRoot>;
};

Cypress.Commands.add("mountSpringRoot",
	(children, ...props) => mount(<TestContainer children={children} {...props} />));
