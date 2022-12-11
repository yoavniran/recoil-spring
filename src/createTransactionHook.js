import { useRecoilTransaction_UNSTABLE as useRecoilTransaction } from "recoil";
import { useSpring } from "./context";
import { getFamilyTrackerSetters, getTracker } from "./family";

const createTransactionHook = (setter) =>
	(deps = []) => {
		const spring = useSpring();

		if (!spring) {
			throw new Error("recoil:spring - couldn't find Spring instance from Context for Transaction Hook");
		}

		return useRecoilTransaction((actions) =>
			(...args) => {
				const trackerSetters = getFamilyTrackerSetters({
					...actions, spring,
				});

				setter({
					...actions,
					...trackerSetters,
					getTracker: (atomFamily) => getTracker(actions.get, atomFamily),
				}, ...args);
			}, deps);
	};

export default createTransactionHook;
