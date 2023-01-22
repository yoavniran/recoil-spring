import {
	READONLY_SELECTOR,
	FamilySelectorGetter,
	SelectorHookType,
	SelectorParams,
	FamilySelectorSetter,
} from "./common";
import { RecoilState } from "recoil";

export function createSelectorFamilyHook<T, P = string, WRITEABLE extends READONLY_SELECTOR = true>(
	getter: RecoilState<T> | FamilySelectorGetter<T, P>,
	setter?: FamilySelectorSetter<T> | WRITEABLE,
	selectorParams?: SelectorParams,
): SelectorHookType<T, WRITEABLE>;

export function createSelectorFamilyHookWithKey<T, P = string, WRITEABLE extends READONLY_SELECTOR = true>(
	key: string,
	getter: RecoilState<T> | FamilySelectorGetter<T, P>,
	setter?: FamilySelectorSetter<T> | WRITEABLE,
	selectorParams?: SelectorParams,
): SelectorHookType<T, WRITEABLE>;
