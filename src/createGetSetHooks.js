import { isRecoilValue, useRecoilValue, useSetRecoilState } from "recoil";
import { invariant, isString } from "./utils";
import createSelector from "./createSelector";

const createGetSetHooks = (key, getter, setter) => {
	if (!isString(key)) {
		setter = getter;
		getter = key;
		key = null;
	}

	const isGetterRecoilVal = isRecoilValue(getter),
	 usedKey = key || (isGetterRecoilVal && (getter.key + "SpringGetSetSelector"));

	invariant(usedKey, "recoil:spring - GetSetHooks key not provided and could not be generated");

	const { hookSelector } = createSelector(key, getter, setter);

	const useSetHook = () => useSetRecoilState(hookSelector);
	const useGetHook = () => useRecoilValue(hookSelector);

	return { useSetHook, useGetHook };
};

export default createGetSetHooks;
