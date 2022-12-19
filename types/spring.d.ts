import { RecoilState } from "recoil";
import { AtomMetadata } from "./common";

export interface Spring<T> {
	atoms: T;
	getAtomsEntries: () => T;
	getAtom: <T>(name: string) => RecoilState<T>;
	getTrackerAtom: <T>(name: string) => RecoilState<T[]>;
	getMetadata: (name: string) => AtomMetadata;
	add: (name: string, defaultValue: any) => Spring<T>;
  addFamily: (name: string, defaultValue: unknown) => Spring<T>;
}

export function createSpring<T>(defaults: Record<string, unknown>): Spring<T>;
