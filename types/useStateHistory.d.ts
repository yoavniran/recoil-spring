import { MutableSnapshot, RecoilState } from "recoil";

export type HistoryControls = {
	previousCount: number;
	nextCount: number;
	goForward: () => void;
	goBack: () => void;
};

export interface HistoryProps {
	include?: RecoilState<any>[];
	maxItems?: number;
	merge?: boolean;
	navMutator?: (mutableSnapshot: MutableSnapshot) => void;
}

export function useStateHistory(props: HistoryProps): HistoryControls;
