import { useRecoilState, useRecoilValue } from "recoil";
import { isString } from "./utils";
import createSelector from "./createSelector";

const createSelectorHook = (key, getter, setter = null, selectorParams = {}) => {
	if (!isString(key)) {
		selectorParams = setter;
		setter = getter;
		getter = key;
		key = null;
	}

	const { allowWrite, hookSelector } = createSelector(getter, setter, key, selectorParams);

	const useHook = allowWrite ? () =>
			useRecoilState(hookSelector) :
		() => useRecoilValue(hookSelector);

	useHook.selector = hookSelector;

	return useHook;
};

const createSelectorHookWithKey = (key, getter, setter = null, selectorParams) =>
	createSelectorHook(key, getter, setter, selectorParams);

export {
	createSelectorHook,
	createSelectorHookWithKey
};
