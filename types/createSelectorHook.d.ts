import { RecoilState } from "recoil";

import {
	SelectorGetter,
	// SelectorHook,
	// ReadonlySelectorHook,
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

// export type CreateSelectorHookMethod = <T, WRITEABLE extends READONLY_SELECTOR = true>(
// 	getter: RecoilState<T> | SelectorGetter,
// 	setter?: SelectorSetter<T> | WRITEABLE,
// 	selectorParams?: SelectorParams
// ) => SelectorHookType<T, WRITEABLE>;
//
// export declare const createSelectorHook: CreateSelectorHookMethod;


	//SelectorHookType<T, WRITEABLE>;

// export const createSelectorHook = <T>(
// 	getter: RecoilState<T>,
// 	setter: false,
// 	selectorParams?: SelectorParams,
// ) => ReadonlySelectorHook<T>;
//
// export const createSelectorHook = <T>(
// 	getter: RecoilState<T>,
// 	setter: true,
// 	selectorParams?: SelectorParams,
// ) => SelectorHook<T>;

// export const createSelectorHookWithKey = <T>(
//
// )
