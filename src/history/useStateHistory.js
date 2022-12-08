import { useCallback } from "react";
import {
	isRecoilValue,
	useRecoilTransactionObserver_UNSTABLE as useRecoilTransactionObserver,
} from "recoil";
import { findTrackerNameInStore } from "../family";
import { getAtomFamilyRootName } from "../utils";
import useStateTimeTravel from "./useStateTimeTravel";
import { useSpring } from "../context";

const DEFAULT_MAX_ITEMS = 10;

const getAtomsForDiff = (include, getAtomsData) => {
	const { atoms } = getAtomsData();
	return include.map((a) => isRecoilValue(a) ?
		a :
		atoms[findTrackerNameInStore(getAtomFamilyRootName(a), getAtomsData)]);
};

const getHasDiffs = (snapshot, prevSnapshot, atoms) => {
	return (!prevSnapshot && snapshot) ||
		!!atoms.find((a) => {
			const res = snapshot.getLoadable(a).contents !== prevSnapshot.getLoadable(a).contents;
			if (res) {
				console.log("FOUND SNAPSHOT DIFF FOR HISTORY ", a);
			}
			return res;
		});
};

const getHistoryAtoms = (include, getAtomsData) => {
	//if include not provided, use all atoms in spring
	const usedInclude = include ? include : Object.values(getAtomsData().atoms);
	const undefIndx = usedInclude.findIndex((a) => !a);

	if (~undefIndx) {
		throw new Error(`recoil:spring - State History received undefined as part of 'include' list! (index = ${undefIndx}`);
	}

	return usedInclude;
};

const useStateHistory = ({ include, maxItems = DEFAULT_MAX_ITEMS, navMutator = null }) => {
	const { getAtomsData } = useSpring() || {};

	if (!getAtomsData) {
		throw new Error("recoil:spring - couldn't find Atoms Data from Context for State History");
	}

	const usedInclude = getHistoryAtoms(include, getAtomsData);
	const diffAtoms = getAtomsForDiff(usedInclude, getAtomsData);

	const {
		doTimeTravel,
		addHistory,
		counters,
	} = useStateTimeTravel({ include: diffAtoms, navMutator, maxItems });

	useRecoilTransactionObserver(({ snapshot, previousSnapshot }) => {
		const id = snapshot.getID();

		if (id !== previousSnapshot?.getID()) {
			if (getHasDiffs(snapshot, previousSnapshot, diffAtoms)) {
				addHistory(previousSnapshot, snapshot);
			}
		}
	});

	const goForward = useCallback(() => doTimeTravel(1), [doTimeTravel]);
	const goBack = useCallback(() => doTimeTravel(-1), [doTimeTravel]);

	return {
		previousCount: counters[0],
		nextCount: counters[1],
		goForward,
		goBack,
	};
};

export default useStateHistory;
