import { selector, isRecoilValue } from "recoil";
import { invariant } from "./utils";
import { getTracker } from "./family";

const createSelector = (getter, setter = null, key = null, selectorParams = {}) => {
	invariant(getter, setter, "recoil:spring - can't create a selector with neither a getter nor a setter");

	const isGetterRecoilVal = isRecoilValue(getter),
		allowWrite = setter !== false && (setter || (!setter && isGetterRecoilVal));

	const usedKey = key || (isGetterRecoilVal && (getter.key + "SpringSelector"));
	invariant(usedKey, "recoil:spring - Selector key not provided and could not be generated");

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
