import { RecoilState } from "recoil";
import { createSpring } from "recoil-spring";

type SpringTypes = {
	age: RecoilState<number>,
	name: RecoilState<string>,
	color: RecoilState<string>,

	test: RecoilState<number>,
	foo: RecoilState<string>,
};

const spring = createSpring<SpringTypes>({
	age: 0,
	name: "",
	color: "#000",
	test: 1,
});

export const atoms = spring.atoms;

export default spring;
