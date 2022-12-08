import { selector, isRecoilValue } from "recoil";
import { DUMMY_RECOIL_SPRING_ATOM } from "./consts";
import { getTrackerForAtom } from "./family";

const createSelector = (getter, setter = null, key = null, selectorParams = {}) => {
	if (!getter && !setter) {
		throw new Error("recoil:spring - can't create a selector without neither a getter or a setter");
	}

	const isGetterRecoilVal = isRecoilValue(getter),
		allowWrite = setter !== false && (setter || (!setter && isGetterRecoilVal));

	const usedKey = key || (isGetterRecoilVal && (getter.key + "SpringSelector") );

	if (!usedKey) {
		throw new Error("recoil:spring - Selector key not provided and could not be generated");
	}

	const getTracker = (get, atomFamily) => {
		const { getAtomsData } = get(DUMMY_RECOIL_SPRING_ATOM),
			trackerAtom = getTrackerForAtom(atomFamily, getAtomsData);

		return get(trackerAtom);
	};

	const hookSelector = selector({
		key: usedKey,
		set: allowWrite ?
			({ get, set, reset }, newValue) =>
				setter || !isGetterRecoilVal ?
					//use custom setter
					setter(newValue, { get, set, reset }) :
					//set the new value to the atom
					set(getter, newValue) :
			undefined,
		get: ({ get }) => isGetterRecoilVal ?
			//get atom directly
			get(getter) :
			//execute getter callback
			getter(get, (atomFamily) => getTracker(get, atomFamily)),
		...selectorParams,
	});

	return { allowWrite, hookSelector };
};

export default createSelector;
