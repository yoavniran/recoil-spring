import { atom } from "recoil";
import { DUMMY_RECOIL_SPRING_ATOM } from "../consts";
import { isString, getAtomFamilyParts, getAtomFamilyRootName } from "../utils";

const TRACKER_EXT = "$$tracker";

const getTrackerAtomName = (name) => name + TRACKER_EXT;

const getTrackerForAtom = (atomFamily, getAtom) => {
	return isString(atomFamily) ?
		getAtom(getTrackerAtomName(atomFamily)) :
		getAtom(getTrackerAtomName(getAtomFamilyRootName(atomFamily)));
};

const createTrackerAtom = (name) => {
	const trackerName = getTrackerAtomName(name);
	//for family create a tracker atom
	const trackerAtom = atom({ key: trackerName, default: [] });

	return { name: trackerName, atom: trackerAtom };
};

const findTrackerNameInStore = (name, spring) => {
	const atomMeta = spring.getMetadata(name);
	return atomMeta?.tracker;
};

const updateAtomTracker = (spring, atom, fn) => {
	if (spring) {
		//update tracker with new key to track
		const familyKeyParts = getAtomFamilyParts(atom);

		if (familyKeyParts.length > 1) {
			const atomName = familyKeyParts[0];
			const trackerName = findTrackerNameInStore(atomName, spring);

			if (trackerName && familyKeyParts[1]) {
				//use JSON.parse like recoil does
				const param = JSON.parse(familyKeyParts[1]);
				fn(trackerName, param);
			}
		}
	}
};

const getTracker = (get, atomFamily) => {
	const spring = get(DUMMY_RECOIL_SPRING_ATOM),
		trackerAtom = getTrackerForAtom(atomFamily, spring.getAtom);

	return get(trackerAtom);
};

export {
	TRACKER_EXT,
	createTrackerAtom,
	getTrackerAtomName,
	findTrackerNameInStore,
	getTrackerForAtom,
	updateAtomTracker,
	getTracker,
};
