import { SpringRoot, createSpring, createGetSetHooks } from "../../src";

const spring = createSpring({
	test: 1,
});

const {
	useGetHook: simpleGetHook,
	useSetHook: simpleSetHook,
} = createGetSetHooks(spring.atoms.test);

const ShowTestValue = () => {
	const testValue = simpleGetHook();

	return (<span>{testValue}</span>);
};

const ChangeTestValue = () => {
	const setValue = simpleSetHook();

	return (
		<button
			onClick={() => setValue((prev) => prev + 1)}>
			change
		</button>
	);
};

export const Simple = () => {

	return (
		<SpringRoot spring={spring}>
			<div>
				<h2>Simple GetSet Hook</h2>
				<ShowTestValue/>
				<br/>
				<ChangeTestValue/>
			</div>
		</SpringRoot>
	);
};

export default {
	title: "createGetSetHooks",
};
