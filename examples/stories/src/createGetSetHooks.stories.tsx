import React, { FC } from "react";
import { SpringRoot, createGetSetHooks } from "recoil-spring";
import spring, { atoms } from "./spring";

const {
	useGetHook: simpleGetHook,
	useSetHook: simpleSetHook,
} = createGetSetHooks<number>(atoms.test);

const ShowTestValue: FC = () => {
	const testValue = simpleGetHook();

	return (<span id="testValue">{testValue}</span>);
};

const ChangeTestValue = () => {
	const setValue = simpleSetHook();

	return (
		<button
			id="changeValueButton"
			onClick={() => setValue((prev) => prev + 1)}>
			change
		</button>
	);
};

export const Simple: FC = () => {
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
