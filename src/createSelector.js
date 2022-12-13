import { selector, isRecoilValue } from "recoil";
import { getTracker } from "./family";

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
		get: ({ get, getCallback }) => isGetterRecoilVal ?
			//get atom directly
			get(getter) :
			//execute getter callback
			getter(get, getCallback, (atomFamily) => getTracker(get, atomFamily)),
		...selectorParams,
	});

	return { allowWrite, hookSelector };
};

export default createSelector;
