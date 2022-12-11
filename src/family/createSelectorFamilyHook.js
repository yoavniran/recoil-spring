import { isRecoilValue, selectorFamily, useRecoilCallback, useRecoilValue } from "recoil";
import { DUMMY_RECOIL_SPRING_ATOM } from "../consts";
import { getAtomFamilyRootName, isEmpty, isString, isFunction } from "../utils";
import getFamilyTrackerSetters from "./getFamilyTrackerSetters";

// TODO: CANT SUPPORT ATOM KEYS WITH DOUBLE __ because recoil uses this as separator! (What does recoil do if you use it?)

//TODO: Need to support all valid param types - https://recoiljs.org/docs/api-reference/utils/atomFamily#parameter-type
//TODO: in case setter is a selector, we cant make use of the tracker! need to warn about this
//TODO: Need to support useResetRecoilState - https://recoiljs.org/docs/api-reference/core/useResetRecoilState

const createSelector = ({ key, allowWrite, getter, setter, isGetterRecoilVal, selectorParams }) => {
	return selectorFamily({
		key,
		set: allowWrite ?
			(param) => ({ get, set, reset }, newValue) => {
				const spring = get(DUMMY_RECOIL_SPRING_ATOM);

				const trackerSetters = getFamilyTrackerSetters({
					get, set, reset, spring,
				});

				return setter ?
					//use custom setter
					setter(param, newValue, { get, ...trackerSetters }) :
					//set the new value for the family member
					trackerSetters.set(getter(param), newValue);
			} :
			undefined,

		get: (param) => ({ get }) => isGetterRecoilVal ?
			//get family member directly
			get(getter(param)) :
			//use custom getter
			getter(param, get),

		...selectorParams,
	});
};

const createSelectorFamilyHook = (key, getter, setter, selectorParams = {}) => {
	if (!isString(key)) {
		setter = getter;
		getter = key;
		key = null;
	}

	const isGetterRecoilVal = isRecoilValue(getter),
		allowWrite = (setter !== false),
		familyRoot = isFunction(getter) && getAtomFamilyRootName(getter),
		usedKey = key || (familyRoot && (familyRoot + "SpringFamilySelector"));

	if (!usedKey) {
		throw new Error("recoil:spring - Family Selector key not provided and could not be generated");
	}

	const selector = createSelector({
		key: usedKey,
		allowWrite,
		getter,
		setter,
		isGetterRecoilVal,
		selectorParams,
	});

	const useHook =
		//read only
		!allowWrite ? (hookParam) =>
				useRecoilValue(selector(hookParam)) :
			(hookParam) =>
				//use callback to be able to return [value, setter] tuple
				useRecoilCallback(({ set }) => (autoParam) => {
					return [
						//TODO: need to test this !!!!!!
						!isEmpty(autoParam) && useRecoilValue(selector(autoParam)),
						(...args) => {
							const param = autoParam || args[0];
							set(selector(param), args.length === 1 ? args[0] : args[1]);
						},
					];
				}, [])(hookParam);

	useHook.selector = selector;

	return useHook;
};

export default createSelectorFamilyHook;
