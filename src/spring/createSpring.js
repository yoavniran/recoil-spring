import { atom as createAtom, atomFamily as creatAtomFamily } from "recoil";
import { RECOIL_SPRING_ATOM_KEY } from "../consts";
import { createTrackerAtom } from "../family";

const createRecord = (name, defaultValue) => {
	const isFamily = name.endsWith("*");
	const cleanName = name.replace(/\*$/, "");
	const createFunction = isFamily ? creatAtomFamily : createAtom;
	const tracker = isFamily ? createTrackerAtom(cleanName) : null;
	const atom = createFunction({ key: cleanName, default: defaultValue });

	return {
		name,
		cleanName,
		tracker,
		defaultValue,
		atom,
		isFamily,
	};
};

const addRecord = (registry, name, defaultValue) => {
	const { atom, cleanName, tracker, isFamily } = createRecord(name, defaultValue);

	if (tracker) {
		registry.metadata[tracker.name] = {
			name: tracker.name,
			fullName: tracker.name,
			isFamily: false,
			isTracker: true,
			tracked: cleanName,
		};

		registry.atoms[tracker.name] = tracker.atom;
	}

	registry.metadata[cleanName] = {
		name: cleanName,
		fullName: name,
		isFamily,
		tracker: tracker?.name,
	};

	registry.atoms[cleanName] = atom;

	return registry;
};

const createSpring = (list = {}) => {
	//TODO: make atomsData immutable for the outside world

	const atomsData = Object.entries(list || {})
		.reduce((res, [name, defaultValue]) =>
				addRecord(res, name, defaultValue),
			{ metadata: {}, atoms: {} });

	const getAtomsData = () => atomsData;

	const getAtoms = () => getAtomsData().atoms;

	const add = (name, defaultValue) => {
		addRecord(atomsData, name, defaultValue);
		return spring;
	};

	const spring = {
		getAtomsData,
		getAtoms,
		add,
	};

	//we store the registry methods inside recoil so we can access it from our hooks
	createAtom({
		key: RECOIL_SPRING_ATOM_KEY,
		default: { getAtomsData, getAtoms },
	});

	return spring;
};

export default createSpring;
