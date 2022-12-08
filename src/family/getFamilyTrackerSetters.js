import { findTrackedAtom, getTrackerForAtom, updateAtomTracker } from "./familyTrackerAtom";

const getFamilyTrackerSetters = ({ get, set, reset, getAtomsData }) => {
	const setWithTracker = (atom, val) => {
		updateAtomTracker(getAtomsData, atom, (trackerName, param) => {
			set(getAtomsData().atoms[trackerName], (prev) =>
				prev.includes(param) ? prev : [param, ...prev]);
		});

		set(atom, val);
	};

	const resetWithTracker = (atom) => {
		updateAtomTracker(getAtomsData, atom, (trackerName, param) => {
			set(getAtomsData().atoms[trackerName], (prev) => {
				const indx = prev.indexOf(param);
				return ~indx ? [...prev.slice(0, indx), ...prev.slice(indx + 1)] : prev;
			});
		});

		reset(atom);
	};

	const resetFamily = (atomFamily) => {
		const trackerAtom = getTrackerForAtom(atomFamily, getAtomsData),
		 tracker = get(trackerAtom);
		 // rootAtom = findTrackedAtom(tracker, getAtomsData);

		tracker.forEach((index) => reset(atomFamily(index)));

		reset(trackerAtom);
	};

	return {
		set: setWithTracker,
		reset: resetWithTracker,
		resetFamily,
	};
};

export default getFamilyTrackerSetters;
