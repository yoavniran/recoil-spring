import { useState, useCallback, useEffect, useRef } from "react";
import { useGotoRecoilSnapshot } from "recoil";
import { getTrackerAtomName } from "../family";
import { getAtomFamilyRootName } from "../utils";
import { useSpring } from "../context";

const getIsMergeableNode = (node, include, getAtomsData) => {
	let isMergeable = include.includes(node);

	if (!isMergeable) {
		//check if tracker was included for an atomFamily
		const { atoms } = getAtomsData(),
			//TODO: skip if node is already the tracker
			//TODO: skip RecoilValueReadOnly (selector)
			trackerName = getTrackerAtomName(getAtomFamilyRootName(node)),
			trackerAtom = atoms[trackerName];

		isMergeable = !!trackerAtom && include.includes(trackerAtom);
	}

	return isMergeable;
};

const getTargetSnapshot = (currentSnapshot, nextSnapshot, { include, mutator, merge, getAtomsData }) => {
	const targetSnapshot = merge ? currentSnapshot : nextSnapshot;

	return (!merge && !mutator) ?
		targetSnapshot :
		targetSnapshot.map((mutable) => {
			if (merge) {
				const changedNodesItr = currentSnapshot.getNodes_UNSTABLE();

				for (let node of changedNodesItr) {
					if (getIsMergeableNode(node, include, getAtomsData)) {
						//merge the value from the target snapshot
						mutable.set(node, nextSnapshot.getLoadable(node).contents);
					}
				}
			}

			//allow mutations of the snapshot before its applied
			mutator?.(mutable);
		});
};

const useStateTimeTravel = ({ include, maxItems, navMutator = null, merge = true }) => {
	const { getAtomsData } = useSpring() || {};

	if (!getAtomsData) {
		throw new Error("recoil:spring - couldn't find Atoms Data from Context for State Time Travel");
	}

	const [previous, setPrevious] = useState([]);
	const [next, setNext] = useState([]);
	const [current, setCurrent] = useState(null);
	const releasers = useRef(new Map());
	const gotoSnapshot = useGotoRecoilSnapshot();

	const retainSnapshot = (snapshot) => {
		const release = snapshot.retain();
		const id = snapshot.getID();

		if (releasers.current.has(id)) {
			releasers.current.get(id)();
		}

		releasers.current.set(id, release);
	};

	useEffect(() => {
		const all = next.concat(previous).concat(current || [])
			.map((snap) => snap.getID());

		releasers.current
			.forEach((release, id) => {
				if (!all.includes(id)) {
					//release snapshot no longer tracked by history
					release();
					releasers.current.delete(id);
				}
			});

	}, [next, previous, current]);

	const doTimeTravel = useCallback((direction) => {
		const dirSnapshots = direction < 0 ? previous : next;

		if (dirSnapshots.length) {
			const snapshot = dirSnapshots.slice(0, 1)[0],
				subtract = direction < 0 ? setPrevious : setNext,
				add = direction < 0 ? setNext : setPrevious;

			subtract((prev) => prev.slice(1));
			add((prev) => [current, ...prev]);

			const targetSnapshot = getTargetSnapshot(current, snapshot, {
				include,
				getAtomsData,
				navMutator,
				merge,
			});

			retainSnapshot(targetSnapshot);

			setCurrent(targetSnapshot);
			gotoSnapshot(targetSnapshot);
		}
	}, [previous, next, current]);

	const addHistory = (prevSnap, nextSnap) => {
		//store the previous snapshot in the history
		retainSnapshot(prevSnap);

		setPrevious((prev) => [prevSnap, ...prev.slice(0, (maxItems - 1))]);

		//clear next snapshots on a new (non-historical) snapshot
		setNext([]);

		//store the current snapshot as our "present"
		retainSnapshot(nextSnap);
		setCurrent(nextSnap);
	};

	return {
		addHistory,
		doTimeTravel,
		counters: [previous.length, next.length],
	};
};

export default useStateTimeTravel;
