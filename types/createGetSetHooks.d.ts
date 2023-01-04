import {
	SelectorGetter,
	SelectorParams,
	SelectorSetter,
} from "./common";
import { RecoilState, SetterOrUpdater } from "recoil";

export type GetSetHooks<T> = {
	useGetHook: () => T,
	useSetHook: () => SetterOrUpdater<T>
};

export function createGetSetHooks<T>(
	getter: RecoilState<T> | SelectorGetter<T>,
	setter?: SelectorSetter<T>,
	selectorParams?: SelectorParams
): GetSetHooks<T>;

export function createGetSetHooksWithKey<T>(
	key: string,
	getter: RecoilState<T> | SelectorGetter<T>,
	setter?: SelectorSetter<T>,
	selectorParams?: SelectorParams
): GetSetHooks<T>;

