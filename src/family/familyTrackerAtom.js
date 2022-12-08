import { atom } from "recoil";
import isString from "lodash/isString";
import { getAtomFamilyParts, getAtomFamilyRootName } from "../utils";

const TRACKER_EXT = "$$tracker";

const getTrackerAtomName = (name) => name + TRACKER_EXT;

const getTrackerForAtom = (atom, getAtomsData) => {
	const { atoms } = getAtomsData();
	return isString(atom) ?
		atoms[getTrackerAtomName(atom)] :
		atoms[getTrackerAtomName(getAtomFamilyRootName(atom))];
};

const createTrackerAtom = (name) => {
	const trackerName = getTrackerAtomName(name);
	//for family create a tracker atom
	const trackerAtom = atom({ key: trackerName, default: [] });

	return { name: trackerName, atom: trackerAtom }
};

const findTrackerNameInStore = (name, getAtomsData) => {
	const { metadata } = getAtomsData();
	const atomMeta = metadata[name];
	return atomMeta?.tracker;
};

const findTrackedAtom = (trackerAtom, getAtomsData) => {
	const { atoms, metadata} = getAtomsData();
	const atomMeta = metadata[trackerAtom.key];
	return atoms[atomMeta.tracked];
};

const updateAtomTracker = (getAtomsData, atom, fn) => {
	if (getAtomsData) {
		//update tracker with new key to track
		const familyKeyParts = getAtomFamilyParts(atom);

		if (familyKeyParts.length > 1) {
			const atomName = familyKeyParts[0];
			const trackerName = findTrackerNameInStore(atomName, getAtomsData);

			if (trackerName && familyKeyParts[1]) {
				const param = JSON.parse(familyKeyParts[1]);
				fn(trackerName, param);
			}
		}
	}
};

export {
	TRACKER_EXT,
	createTrackerAtom,
	getTrackerAtomName,
	findTrackerNameInStore,
	getTrackerForAtom,
	updateAtomTracker,
	findTrackedAtom,
};
