import { RecoilState } from "recoil";

import {
	SelectorGetter,
	SelectorParams,
	SelectorSetter,
	SelectorHookType,
	READONLY_SELECTOR,
} from "./common";

export function createSelectorHook<T, WRITEABLE extends READONLY_SELECTOR = true>(
	getter: RecoilState<T> | SelectorGetter<T>,
	setter?: SelectorSetter<T> | WRITEABLE,
	selectorParams?: SelectorParams
): SelectorHookType<T, WRITEABLE>;

export function createSelectorHookWithKey<T, WRITEABLE extends READONLY_SELECTOR = true>(
	key: string,
	getter: RecoilState<T> | SelectorGetter<T>,
	setter?: SelectorSetter<T> | WRITEABLE,
	selectorParams?: SelectorParams
): SelectorHookType<T, WRITEABLE>;

