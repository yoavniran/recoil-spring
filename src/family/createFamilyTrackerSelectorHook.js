import { useRecoilValue } from "recoil";
import { isString } from "../utils";
import { createFamilyTrackerSelector } from "./createFamilyTrackerSelector";

const createFamilyTrackerSelectorHook = (key, family, customGetter = null, selectorParams) => {
	if (!isString(key)) {
		selectorParams = customGetter;
		customGetter = family;
		family = key;
		key = null;
	}

	const hookSelector = createFamilyTrackerSelector(key, family, customGetter, selectorParams);

	const useHook = () => useRecoilValue(hookSelector);

	useHook.selector = hookSelector;

	return useHook;
};

export {
	createFamilyTrackerSelectorHook,
};

