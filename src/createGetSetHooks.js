import { isRecoilValue, useRecoilValue, useSetRecoilState } from "recoil";
import { invariant, warn, isString } from "./utils";
import createSelector from "./createSelector";

const createGetSetHooks = (key, getter, setter, selectorParams = {}) => {
	if (!isString(key)) {
		selectorParams = setter;
		setter = getter;
		getter = key;
		key = null;
	}

	if (setter === false) {
		warn("recoil:spring - createGetSetHooks received false for setter. Perhaps you meant to use createSelectorHook instead?");
	}

	const isGetterRecoilVal = isRecoilValue(getter),
		usedKey = key || (isGetterRecoilVal && (getter.key + "SpringGetSetSelector"));

	invariant(usedKey, "recoil:spring - GetSetHooks key not provided and could not be generated");

	const { hookSelector } = createSelector(getter, setter, usedKey, selectorParams);

	const useGetHook = () => useRecoilValue(hookSelector);
	const useSetHook = () => useSetRecoilState(hookSelector);

	return { useGetHook, useSetHook };
};

const createGetSetHooksWithKey = (key, getter, setter = null, selectorParams) =>
	createGetSetHooks(key, getter, setter, selectorParams);

export default createGetSetHooks;

export {
	createGetSetHooksWithKey,
};
