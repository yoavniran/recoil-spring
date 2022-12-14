import { useRecoilCallback } from "recoil";
import { getFamilyTrackerSetters } from "./family";
import { DUMMY_RECOIL_SPRING_ATOM } from "./consts";

const createSetterHook = (setter) =>
	(deps = []) => useRecoilCallback((actions) => {
		const get = (loadable) =>
			//TODO: might not be loaded yet...
			actions.snapshot.getLoadable(loadable).contents;

		const spring = get(DUMMY_RECOIL_SPRING_ATOM);

		return (...args) => {
			const trackerSetters = getFamilyTrackerSetters({
				get, ...actions, spring,
			});

			return setter({ ...actions, ...trackerSetters, get }, ...args);
		};
	}, deps);

export default createSetterHook;
