import React from "react";
import SpringRoot from "../SpringRoot";
import createSpring from "../spring";
import createGetSetHooks from "../createGetSetHooks";

describe("createGetSetHooks tests", () => {
	const spring = createSpring({
		test: 1,
	});

	const ShowTestValue = ({ useGetValue }) => {
		const testValue = useGetValue();

		return (<span className="testValue">{testValue}</span>);
	};

	const ChangeTestValue = ({ useSetValue }) => {
		const setValue = useSetValue();

		return (
			<button
				className="changeValueButton"
				onClick={() => setValue((prev) => prev + 1)}>
				change
			</button>
		);
	};

	const Simple = ({ name, children }) => {
		return (
			<SpringRoot spring={spring}>
				<div className={name}>
					<h2>Simple GetSet Hook</h2>
					{children}
				</div>
			</SpringRoot>
		);
	};

	const {
		useGetHook: testGetHook,
		useSetHook: testSetHook,
	} = createGetSetHooks(spring.atoms.test);

	describe("one atom", () => {
		const TestAtom = () =>
			<Simple name="one-atom">
				<ShowTestValue useGetValue={testGetHook}/>
				<br/>
				<ChangeTestValue useSetValue={testSetHook}/>
			</Simple>;

		it("should show initial value", () => {
			cy.mount(<TestAtom/>);
			cy.get(".one-atom .testValue").should("have.text", "1");
		});

		it("should increment values", () => {
			cy.mount(<TestAtom/>);
			cy.get(".one-atom .changeValueButton").click();
			cy.get(".one-atom .testValue").should("have.text", "2");
		});
	});

	describe("two atoms", () => {
		spring.add("foo", "bar");

		const {
			useGetHook: fooGetHook,
			useSetHook: fooSetHook,
		} = createGetSetHooks(spring.atoms.foo);

		const TestTwoAtoms = () =>
			<Simple name="two-atoms">
				<ShowTestValue useGetValue={testGetHook}/>
				<br/>
				<ShowTestValue useGetValue={fooGetHook}/>
				<br/>
				<ChangeTestValue useSetValue={testSetHook}/>
				<br/>
				<ChangeTestValue useSetValue={fooSetHook}/>
			</Simple>;

		it("should show values for two atoms ", () => {
			cy.mount(<TestTwoAtoms/>);
			cy.get(".two-atoms .testValue").eq(0).should("have.text", "1");
			cy.get(".two-atoms .testValue").eq(1).should("have.text", "bar");
		});

		// it("should use get set hooks for different atoms separately", () => {
		// 	cy.mount(<Simple/>);
		// });
	});
});
