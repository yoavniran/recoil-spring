import { useRecoilValue } from "recoil";
import { throttle, debounce } from "throttle-debounce";
import { warn } from "./utils";
import createSetterHook from "./createSetterHook";

const isRefSame = (prev, next) =>
	prev === next ||
	((!!prev && !!next) &&
		(prev.length === next.length &&
			!next.find((val, index) => val !== prev[index])));

const defaults = {
	allowSimultaneousRuns: true,
	debounce: false,
	debounceParams: null,
	throttle: false,
	throttleParams: null,
	depsCompare: isRefSame,
};

const createReactiveSetterHook = (
	selector,
	delay,
	setter,
	options,
) => {
	const usedOptions = {
		...defaults,
		...options,
	};

	if (usedOptions.throttle && usedOptions.debounce) {
		warn("recoil:spring - createReactiveSetterHook both throttle and debounce are truthy. Defaulting to `throttle`");
	}

	let prevDeps = null,
		isSetterFnAwaiting = false;

	const setterFn = (...params) => {
		console.log("@@@ SETTER FUNCTION IS BEING CALLED!", ...params);

		if (usedOptions.allowSimultaneousRuns || !isSetterFnAwaiting) {
			const output = setter(...params);

			if (output?.then
				&& output?.finally &&
				!usedOptions.allowSimultaneousRuns) {
				isSetterFnAwaiting = true;

				output.finally(() => {
					isSetterFnAwaiting = false;
				});
			}
		} else {
			console.log("@@@ PREVENT SIMULTANEOUS RUN !!!!");
		}
	};

	const reactiveSetter =
		usedOptions.throttle ?
			throttle(delay, setterFn, usedOptions.throttleParams) :
			(usedOptions.debounce ?
				debounce(delay, setterFn, usedOptions.debounceParams) :
				setterFn);

	const useSetter = createSetterHook(reactiveSetter);

	return () => {
		const deps = useRecoilValue(selector);
		const depsArr = [].concat(deps);
		const setter = useSetter();

		if (!usedOptions.depsCompare(prevDeps, depsArr)) {
			console.log("@@@ CALLING REACTIVE SETTER FOR DEPS - ", deps);
			prevDeps = depsArr;
			setter(deps);
		}
	};
};

export {
	createReactiveSetterHook,
};
