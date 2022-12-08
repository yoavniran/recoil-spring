import { useRecoilTransaction_UNSTABLE as useRecoilTransaction } from "recoil";
import { useSpring } from "./context";
import { getFamilyTrackerSetters } from "./family";

const createTransactionHook = (setter) =>
	(deps = []) => {
		const { getAtomsData } = useSpring() || {};

		if (!getAtomsData) {
			throw new Error("recoil:spring - couldn't find Atoms Data from Context for Transaction Hook");
		}

		return useRecoilTransaction((actions) =>
			(...args) => {
				const trackerSetters = getFamilyTrackerSetters({
					...actions, getAtomsData,
				});

				setter({ ...actions, ...trackerSetters }, ...args);
			}, deps);
	};

export default createTransactionHook;
