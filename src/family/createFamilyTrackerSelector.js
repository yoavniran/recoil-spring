import { selector } from "recoil";
import { DUMMY_RECOIL_SPRING_ATOM } from "../consts";
import { getAtomFamilyRootName, invariant } from "../utils";
import { TRACKER_EXT } from "./familyTrackerAtom";

const createFamilyTrackerSelector = (key, family, customGetter = null, selectorParams) => {
	const familyRoot = getAtomFamilyRootName(family);
	invariant(familyRoot, `recoil:spring - Failed to find root name for atomFamily`);
	const usedKey = key || familyRoot + TRACKER_EXT + "Selector";

	return selector({
		key: usedKey,
		get: ({ get }) => {
			const spring = get(DUMMY_RECOIL_SPRING_ATOM),
				trackerAtom = spring.getTrackerAtom(family);

			invariant(trackerAtom, `recoil:spring - Failed to find tracker for ${familyRoot} atomFamily`);

			const trackerData = get(trackerAtom);

			return customGetter ? customGetter(trackerData, get) : trackerData;
		},
		...selectorParams,
	});
};

export {
	createFamilyTrackerSelector,
};
