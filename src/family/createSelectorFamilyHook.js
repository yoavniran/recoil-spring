import { isRecoilValue, selectorFamily, useRecoilCallback, useRecoilValue } from "recoil";
import { DUMMY_RECOIL_SPRING_ATOM } from "../consts";
import { getAtomFamilyRootName, isEmpty, isString, isFunction, invariant } from "../utils";
import { getFamilyTrackerSetters } from "./getFamilyTrackerSetters";

//TODO: CANT SUPPORT ATOM KEYS WITH DOUBLE __ because recoil uses this as separator! (What does recoil do if you use it?)
//TODO: Need to support all valid param types - https://recoiljs.org/docs/api-reference/utils/atomFamily#parameter-type
//TODO: in case setter is a selector, we cant make use of the tracker! need to warn about this
//TODO: Need to support useResetRecoilState - https://recoiljs.org/docs/api-reference/core/useResetRecoilState

const createFamilySelector = ({ key, allowWrite, getter, setter, isGetterRecoilVal, selectorParams }) => {
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

		get: (param) => ({ get, getCallback }) => isGetterRecoilVal ?
			//get family member directly
			get(getter(param)) :
			//use custom getter
			getter(param, get, getCallback),

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

	invariant(usedKey, "recoil:spring - Family Selector key not provided and could not be generated");

	const selector = createFamilySelector({
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
			//TODO: what about dependencies?
			(hookParam) =>
				//use callback to be able to return [value, setter] tuple
				useRecoilCallback(({ set }) => (autoParam) => {
					return [
						//TODO: need to test this !!!!!!
						!isEmpty(autoParam) && useRecoilValue(selector(autoParam)),
						(...args) => {
							const param = autoParam || args[0];
							set(selector(param), args.length === 1 ? (autoParam ? args[0] : undefined): args[1]);
						},
					];
				}, [])(hookParam);

	useHook.selector = selector;

	return useHook;
};

const createSelectorFamilyHookWithKey = (key, getter, setter = null, selectorParams) =>
	createSelectorFamilyHook(key, getter, setter, selectorParams);

export {
	createSelectorFamilyHook,
	createSelectorFamilyHookWithKey,
};
