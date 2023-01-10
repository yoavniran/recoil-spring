import { createSpring, springFamily } from "recoil-spring";

export type Todo = {
	id: string;
	title: string;
	description: string;
	dueDate: Date | null,
	done: boolean;
};

export type SpringAtoms = {
	todos: (id: string) => Todo;
	name: string;
	showDesktopAlert: boolean;
};

const spring = createSpring<SpringAtoms>({
	[springFamily("todos")]: null,
	name: "",
	showDesktopAlert: false,
});

export default spring;

export const atoms = spring.atoms;


