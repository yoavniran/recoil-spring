import { useRecoilValue, useSetRecoilState, } from "recoil";
import createSelector from "./createSelector";

const createGetSetHooks = (key, getter, setter) => {
	const { hookSelector } = createSelector(key, getter, setter);

	const useSetHook = () => useSetRecoilState(hookSelector);
	const useGetHook = () => useRecoilValue(hookSelector);

	return { useSetHook, useGetHook };
};

export default createGetSetHooks;
