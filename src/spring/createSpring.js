import { atom as createAtom, atomFamily as creatAtomFamily } from "recoil";
import { RECOIL_SPRING_ATOM_KEY } from "../consts";
import { createTrackerAtom, getTrackerForAtom } from "../family";
import { springFamily } from "../springTypes";

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
	const atomsData = Object.entries(list || {})
		.reduce((res, [name, defaultValue]) =>
				addRecord(res, name, defaultValue),
			{ metadata: {}, atoms: {} });

	const getUserLandSpring = () => ({
		...spring,
		atoms,
	});

	const getAtomsData = () => atomsData;

	const getAtomsList = () => Object.values(getAtomsData().atoms);

	const getAtomsEntries = () => Object.entries(getAtomsData().atoms);

	//TODO: accept atom as "name"
	const getAtom = (name) => getAtomsData().atoms[name];

	const getTrackerAtom = (atomFamily) =>
		getTrackerForAtom(atomFamily, getAtom);

	//TODO: accept atom as "name"
	const getMetadata = (name) => {
		const md = getAtomsData().metadata[name];
		//create a copy
		return md && {...md};
	};

	const add = (name, defaultValue) => {
		addRecord(atomsData, name, defaultValue);
		return getUserLandSpring();
	};

	const addFamily = (name, defaultValue) => {
		addRecord(atomsData, springFamily(name), defaultValue);
		return getUserLandSpring();
	};

	//create read-only atoms map for userland's store
	const atoms = new Proxy({ }, {
		get: (_, name) => getAtom(name),
		ownKeys: () => Object.keys(getAtomsData().atoms),
		getOwnPropertyDescriptor: (target, p) => ({
				configurable: true,
				enumerable: true,
				value: target[p],
				writable: false,
			})
	});

	//Spring atom only consists of functions, which Recoil won't freeze
	const spring = {
		getAtomsList,
		getAtomsEntries,
		getAtom,
		getTrackerAtom,
		getMetadata,
		add,
		addFamily,
	};

	//we store the registry methods inside recoil, so we can access it from our hooks/selectors
	createAtom({
		key: RECOIL_SPRING_ATOM_KEY,
		default: spring,
	});

	return getUserLandSpring();
};

export default createSpring;
