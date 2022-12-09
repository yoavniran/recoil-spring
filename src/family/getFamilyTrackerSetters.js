import { getTrackerForAtom, updateAtomTracker } from "./familyTrackerAtom";

const getFamilyTrackerSetters = ({ get, set, reset, getAtomsData }) => {
	const setWithTracker = (atom, val) => {
		updateAtomTracker(getAtomsData, atom, (trackerName, param) => {
			set(getAtomsData().atoms[trackerName], (prev) =>
				prev.includes(param) ? prev : [...prev, param]);
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
