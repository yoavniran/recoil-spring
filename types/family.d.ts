import {
	READONLY_SELECTOR,
	FamilySelectorGetter,
	SelectorHookType,
	SelectorParams,
	SelectorSetter,
} from "./common";
import { RecoilState } from "recoil";

export function createSelectorFamilyHook<T, P = string, WRITEABLE extends READONLY_SELECTOR = true>(
	getter: RecoilState<T> | FamilySelectorGetter<T, P>,
	setter?: SelectorSetter<T> | WRITEABLE,
	selectorParams?: SelectorParams
): SelectorHookType<T, WRITEABLE>;

// export function createSelectorHookWithKey<T, WRITEABLE extends READONLY_SELECTOR = true>(
// 	key: string,
// 	getter: RecoilState<T> | SelectorGetter<T>,
// 	setter?: SelectorSetter<T> | WRITEABLE,
// 	selectorParams?: SelectorParams
// ): SelectorHookType<T, WRITEABLE>;
