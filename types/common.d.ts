import {
	GetCallback,
	GetRecoilValue,
	ReadOnlySelectorOptions,
	ResetRecoilState,
	SetRecoilState,
	RecoilState, MutableSnapshot, DefaultValue,
} from "recoil";
import { Spring } from "./spring";

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

export type READONLY_SELECTOR = true | false;

export type SelectorHookType<T, WRITEABLE extends READONLY_SELECTOR> =
	WRITEABLE extends true ?
		SelectorHook<T> :
		ReadonlySelectorHook<T>;

export interface SelectorSetterActions<T>  {
	get: GetRecoilValue;
	set: SetRecoilState;
	reset: ResetRecoilState;
}

export type SetRecoilFamilyState = <T>(
	recoilVal: RecoilState<T>,
	newVal: T | DefaultValue | ((prevValue: T) => T | DefaultValue),
	atStart?: boolean
) => void;

export interface FamilySelectorSetterActions<T> extends SelectorSetterActions<T> {
	set: SetRecoilFamilyState;
}

export type SelectorSetter<T> = (newValue: T, actions: SelectorSetterActions<T>) => void;

export type FamilySelectorSetter<T> = (newValue: T, actions: FamilySelectorSetterActions<T>) => void;

export type SelectorGetter<T> = (get: GetRecoilValue, getCallback: GetCallback, getTracker: (atomFamily: (pararm: any) => any) => RecoilState<Array<any>>) => T;

export type FamilySelectorGetter<T, P = string> = (param: P, get: GetRecoilValue) => any;

export type SelectorParams = Pick<ReadOnlySelectorOptions<any>, "dangerouslyAllowMutability" | "cachePolicy_UNSTABLE">;

export type AtomMetadata = {
	name: string;
	fullName: string;
	isFamily: boolean;
	isTracker: boolean;
	tracked: string;
};

export interface StateInitializerProps{
	snapshot: MutableSnapshot;
	spring: Spring<any>;
}

export type StateInitializer = (props: StateInitializerProps) => void;
