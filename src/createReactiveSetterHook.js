import { useRecoilValue } from "recoil";
import { throttle, debounce } from "throttle-debounce";
import { warn } from "./utils";
import createSetterHook from "./createSetterHook";

const isRefsSame = (prev, next) =>
	prev === next ||
	((!!prev && !!next) &&
		(prev.length === next.length &&
			!next.find((val, index) => val !== prev[index])));

const defaults = {
	delay: 0,
	debounce: false,
	debounceParams: null,
	throttle: false,
	throttleParams: null,
	depsCompare: isRefsSame,
};

const createReactiveSetterHook = (
	selector,
	setter,
	options,
) => {
	const usedOptions = {
		...defaults,
		...options,
	};

	let prevDeps = null; // isSetterFnAwaiting = false;

	if (usedOptions.throttle && usedOptions.debounce) {
		warn("recoil:spring - createReactiveSetterHook both throttle and debounce are truthy. Defaulting to `throttle`");
	}

	// const setterFn = (...params) => {
	// 	console.log("@@@ SETTER FUNCTION IS BEING CALLED!", ...params);
	// 		return setter(...params);
	// };

	const reactiveSetter =
		usedOptions.throttle ?
			throttle(usedOptions.delay, setter, usedOptions.throttleParams) :
			(usedOptions.debounce ?
				debounce(usedOptions.delay, setter, usedOptions.debounceParams) :
				setter);

	const useSetter = createSetterHook(reactiveSetter);

	return () => {
		const setter = useSetter(),
			deps = useRecoilValue(selector),
			depsArr = [].concat(deps);

		if (!usedOptions.depsCompare(prevDeps, depsArr)) {
			prevDeps = depsArr;
			setter(deps);
		}
	};
};

export {
	createReactiveSetterHook,
};
