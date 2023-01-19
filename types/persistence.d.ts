import { MutableSnapshot, RecoilState } from "recoil";
import { StateInitializer } from "./common";

export type CustomInitializer = (data: Record<string, any>, snapshot: MutableSnapshot) => void;

export interface LocalStorageInitializerProps {
	key: string;
	customInitializer?: CustomInitializer;
	onErrorHandler?: (ex: Error) => void;
}

export function getLocalStorageInitializer(props: LocalStorageInitializerProps): StateInitializer;

export interface LocalStoragePersistenceProps {
	key: string;
	ignore?: RecoilState<any>[] | string[];
}

export function useLocalStoragePersistence(props: LocalStoragePersistenceProps): void;
