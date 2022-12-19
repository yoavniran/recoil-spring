import { CallbackInterface, RecoilValue } from "recoil";

type SetterHook<Args extends ReadonlyArray<unknown>> =
	(deps?: ReadonlyArray<unknown>) => (...args: Args) => void

export type SetterActions = CallbackInterface & {
	get: <T>(a: RecoilValue<T>) => T,
};

export function createSetterHook<Args extends ReadonlyArray<unknown>>(
	setter: (actions: SetterActions, ...args: Args) => void
): SetterHook<Args>
