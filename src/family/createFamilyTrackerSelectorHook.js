import { selector, useRecoilValue } from "recoil";
import { DUMMY_RECOIL_SPRING_ATOM } from "../consts";
import { getAtomFamilyRootName, invariant, isString } from "../utils";
import { TRACKER_EXT } from "./familyTrackerAtom";

const createFamilyTrackerSelectorHook = (key, family, customGetter = null, selectorParams) => {
	if (!isString(key)) {
		selectorParams = customGetter;
		customGetter = family;
		family = key;
		key = null;
	}

	const familyRoot = getAtomFamilyRootName(family);
	invariant(familyRoot, `recoil:spring - Failed to find root name for atomFamily`);
	const usedKey = key || familyRoot + TRACKER_EXT + "Selector";

	const hookSelector = selector({
		key: usedKey,
		get: ({ get }) => {
			const spring = get(DUMMY_RECOIL_SPRING_ATOM),
				trackerAtom = spring.getTrackerAtom(family);

			invariant(trackerAtom, `recoil:spring - Failed to find tracker for ${familyRoot} atomFamily`);

			const trackerData = get(trackerAtom);

			return customGetter ? customGetter(trackerData) : trackerData;
		},
		...selectorParams,
	});

	const useHook = () => useRecoilValue(hookSelector);

	useHook.selector = hookSelector;

	return useHook;
};

export {
	createFamilyTrackerSelectorHook
};

