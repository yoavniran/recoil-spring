import { MutableSnapshot, RecoilState, Snapshot } from "recoil";

export interface HistoryProps {
	include?: RecoilState<any>[];
	maxItems?: number;
	merge?: boolean;
	navMutator?: (mutableSnapshot: MutableSnapshot) => void;
}

export interface TimeTravelProps extends HistoryProps {
	include: RecoilState<any>[];
	maxItems: number;
}

export type TimeTravelControls = {
	counters: [number, number];
	addHistory: (prevSnap: Snapshot, nextSnap: Snapshot) => void;
	doTimeTravel: (direction: 1 | -1) => void;
	storeLatest: (snapshot: Snapshot) => void;
};

export function useStateTimeTravel(props: TimeTravelProps): TimeTravelControls;

export type HistoryControls = {
	previousCount: number;
	nextCount: number;
	goForward: () => void;
	goBack: () => void;
};

export function useStateHistory(props: HistoryProps): HistoryControls;
