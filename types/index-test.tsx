import * as React from "react";
import { GetRecoilValue, RecoilState, selector, useRecoilState, useRecoilValue } from "recoil";
import {
	createSpring,
	createSelectorHook,
	SelectorSetterActions, createSelectorHookWithKey, createSetterHook,
} from "./index";

//store

type Photo = {
	id: string,
	url: string,
};

interface MyAtoms {
	size: RecoilState<number>;
	color: RecoilState<string>;
	photos: (param: string) => RecoilState<Photo>;
	test: RecoilState<number>;
}

const spring = createSpring<MyAtoms>({
	size: 1,
	color: "#000",
	photos: null,
});

spring
	.add("more", 123)
	.addFamily("uploads", null);

//--------------------------------------------------
//selectors
const useAppColor = createSelectorHook<string>(
	spring.atoms.color,
	(newValue: string, { set }: SelectorSetterActions<string>) => {
		set(spring.atoms.color, newValue);
	},
);

type ComputedVals = { color: string, size: number };

const useComputed = createSelectorHook<ComputedVals, false>(
	(get: GetRecoilValue) => {
		return {
			color: get(spring.atoms.color),
			size: get(spring.atoms.size),
		};
	},
);

const useComputedSelector = useComputed.selector;

const testSelector = selector<ComputedVals>({
	key: "test test",
	get: ({ get }) => {
		return get(useComputedSelector);
	}
});

const useReadOnlyColor = createSelectorHookWithKey<string, false>(
	"readonlyColorSelector",
	spring.atoms.color,
	false
);

//setters

const useTestSetter = createSetterHook(({ get, set }, extender: number) => {
	const size = get(spring.atoms.size);
	set(spring.atoms.test, (prev) => prev + size * extender);
});


//--------------------------------------------------
//components

const App = (): JSX.Element => {
	const [ color, setColor ] = useAppColor();
	const computed = useRecoilValue(testSelector);
	const roColor = useReadOnlyColor();
	const extendTest = useTestSetter();

	const onChangeColor = () => {
		extendTest(3);
		setColor("#FFF");
	};

	return (
		<main style={{ backgroundColor: color }}>
			<button onClick={onChangeColor}/>
			{computed.size}
			{computed.color}
			{roColor}
			<AppOptions />
		</main>
	);
};

const AppOptions = (): JSX.Element => {
	const { color, size } = useComputed();

	return (
		<ul>
			<li>color = {color}</li>
			<li>size = {size}</li>
		</ul>
	);
};

export default App;
