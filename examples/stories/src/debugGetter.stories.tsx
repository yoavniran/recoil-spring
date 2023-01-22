import React, { FC, useEffect } from "react";
import { SpringRoot, createSelectorHookWithKey } from "recoil-spring";
import spring, { atoms } from "./spring";
import { RecoilState, SelectorCallbackInterface } from "recoil";

const useDebugGetter = createSelectorHookWithKey(
	"debugGetterSelector",
	(get, getCallback) => {
		return getCallback(
			(cbInterface: SelectorCallbackInterface) => (name: string) => {
				// console.log("CALLBACK CALLED ", { name, cbInterface,});

				return cbInterface
					.snapshot
					.getLoadable(spring.getAtom(name)).contents
		});
	},
	false
);

const DebugGetter = () => {
	const getter = useDebugGetter();

	useEffect(() => {
		//@ts-ignore
		window.getAtomValue = (name) => {
			return getter(name);
		};
	}, [getter]);

	return null;
}

export const Simple: FC = () => {

	return (
		<SpringRoot spring={spring}>
			<div>
				<h2>Example of debug getter</h2>
				<p>Use window.getAtomValue in dev console</p>
				<DebugGetter />
			</div>
		</SpringRoot>
	);
};

export default {
	title: "debugGetter",
};
