import { updateAtomTracker } from "./familyTrackerAtom";

const getFamilyTrackerSetters = ({ get, set, reset, spring }) => {
	const setWithTracker = (atom, val, atStart = false) => {
		updateAtomTracker(spring, atom, (trackerName, param) => {
			set(spring.getAtom(trackerName), (prev) =>
				prev.includes(param) ?
					//already exists, dont add
					prev :
					//new param, add as last by default or at start if requested
					(atStart ? [param, ...prev] : [...prev, param]));
		});

		set(atom, val);
	};

	const resetWithTracker = (atom) => {
		updateAtomTracker(spring, atom, (trackerName, param) => {
			set(spring.getAtom(trackerName), (prev) => {
				const indx = prev.indexOf(param);
				return ~indx ? [...prev.slice(0, indx), ...prev.slice(indx + 1)] : prev;
			});
		});

		reset(atom);
	};

	const resetFamily = (atomFamily) => {
		const trackerAtom = spring.getTrackerAtom(atomFamily),
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

export {
	getFamilyTrackerSetters,
};
