import { atom as createAtom, atomFamily as creatAtomFamily } from "recoil";
import { RECOIL_SPRING_ATOM_KEY } from "../consts";
import { createTrackerAtom, getTrackerForAtom } from "../family";
import { springFamily } from "../springTypes";
import { invariant } from "../utils";

const createRecord = (name, defaultValue) => {
	const isFamily = name.endsWith("*"),
		cleanName = name.replace(/\*$/, ""),
		createFunction = isFamily ? creatAtomFamily : createAtom,
		tracker = isFamily ? createTrackerAtom(cleanName) : null,
		atom = createFunction({ key: cleanName, default: defaultValue });

	return {
		name,
		cleanName,
		tracker,
		defaultValue,
		atom,
		isFamily,
	};
};

//only store simple values in registry + the atoms
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

const createSpring = (defaults = {}) => {
	const atomsData = Object.entries(defaults || {})
		.reduce((res, [name, defaultValue]) =>
				addRecord(res, name, defaultValue),
			{ metadata: {}, atoms: {} });

	const getAtomsData = () => atomsData;

	const getAtomsEntries = () => Object.entries(getAtomsData().atoms);

	//TODO: accept both string and atom
	const getAtom = (name) => getAtomsData().atoms[name];

	const getTrackerAtom = (atomFamily) =>
		getTrackerForAtom(atomFamily, getAtom);

	//TODO: accept both string and atom
	const getMetadata = (name) => {
		const md = getAtomsData().metadata[name];
		//create a copy
		return { ...md };
	};

	const add = (name, defaultValue) => {
		addRecord(atomsData, name, defaultValue);
		return userlandSpring;
	};

	const addFamily = (name, defaultValue) => {
		addRecord(atomsData, springFamily(name), defaultValue);
		return userlandSpring;
	};

	//create read-only atoms-map for userland's store
	const atoms = new Proxy({}, {
		get: (_, name) => {
			const atom = getAtom(name);
			//throw so its less likely to pass an undefined atom to a selector
			invariant(atom, `recoil:spring - '${name}' atom not found!`);
			return atom;
		},
		ownKeys: () => Object.keys(getAtomsData().atoms),
		getOwnPropertyDescriptor: (target, p) => ({
			configurable: true,
			enumerable: true,
			value: target[p],
			writable: false,
		}),
	});

	//Spring atom only consists of functions, which Recoil won't freeze
	const spring = {
		getAtomsEntries,
		getAtom,
		getTrackerAtom,
		getMetadata,
		add,
		addFamily,
	};

	//we store the registry methods inside recoil, so we can access later them from our hooks/selectors
	createAtom({
		key: RECOIL_SPRING_ATOM_KEY,
		default: spring,
	});

	const userlandSpring = {
		...spring,
		atoms,
	};

	return userlandSpring;
};

export default createSpring;
