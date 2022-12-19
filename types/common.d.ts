import {
	GetCallback,
	GetRecoilValue,
	ReadOnlySelectorOptions,
	ResetRecoilState,
	SetRecoilState,
	RecoilState,
} from "recoil";

export type HookReturnedSetter<T> = (val: T) => void;

export type HookResult<T> = [T, HookReturnedSetter<T>];

export type ReadonlySelectorHook<T> = {
	(): T;
	selector: any;
}

export type SelectorHook<T> = {
	(): HookResult<T>;
	selector: any;
}

type READONLY_SELECTOR = true | false;

export type SelectorHookType<T, WRITEABLE extends READONLY_SELECTOR> =
	WRITEABLE extends true ?
		SelectorHook<T> :
		ReadonlySelectorHook<T>;

export type SelectorSetterActions<T>  = {
	get: GetRecoilValue,
	set: SetRecoilState,
	reset: ResetRecoilState,
};

export type SelectorSetter<T> = (newValue: T, actions: SelectorSetterActions<T>) => void;

export type SelectorGetter<T> = (get: GetRecoilValue, getCallback: GetCallback, getTracker: (atomFamily: (pararm: any) => any) => RecoilState<Array<any>>) => T;

export type SelectorParams = Pick<ReadOnlySelectorOptions<any>, "dangerouslyAllowMutability" | "cachePolicy_UNSTABLE">;

export type AtomMetadata = {
	name: string;
	fullName: string;
	isFamily: boolean;
	isTracker: boolean;
	tracked: string;
};
