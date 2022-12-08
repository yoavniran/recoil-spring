import { useRecoilTransactionObserver_UNSTABLE as useRecoilTransactionObserver } from "recoil";
import { useSpring } from "../context";

//TODO: support include list (not just ignore)

const getIsTrackedIgnored = (key, ignore, atoms, metadata) => {
	const trackedName = metadata[key].isTracker && metadata[key].tracked;

	return trackedName &&
		(ignore.includes(trackedName) || ignore.includes(atoms[trackedName]));
};

const getIsIgnored = (key, value, ignore, atoms, metadata)  => {
	return ignore.includes(key) ||
		ignore.includes(value) ||
		getIsTrackedIgnored(key, ignore, atoms, metadata);
};

const getNewPrevContent = (atom, snapshot, prevSnapshot) => {
	const newContent = snapshot.getLoadable(atom).contents,
		prevContent = prevSnapshot.getLoadable(atom).contents;

	return {
		next: newContent,
		prev: prevContent,
		isDiff: prevContent !== newContent
	};
};

const getFamilyContent = (key, trackerIds, snapshot, atoms) => {
	const family = atoms[key];

	return trackerIds.reduce((res, id) => {
		res[id] = snapshot.getLoadable(family(id)).contents;
		return res;
	}, {});
} ;

const useLocalStoragePersistence = ({ key, ignore }) => {
	const { getAtomsData } = useSpring() || {};

	if (!getAtomsData) {
		throw new Error("recoil:spring - couldn't find Atoms Data from Context for LocalStorage Persistence");
	}

	useRecoilTransactionObserver(({ snapshot, previousSnapshot }) => {
		let hasChangesFromPrevious = false;

		const { atoms, metadata } = getAtomsData();

		const data = Object.entries(atoms)
			.reduce((res, [key, value]) => {
				if (!ignore || !getIsIgnored(key, value, ignore, atoms, metadata)) {
					let content;

					if (metadata[key].isFamily) {
						//use tracker to persist family data
						const trackerName = metadata[key].tracker;
						content = getNewPrevContent(atoms[trackerName], snapshot, previousSnapshot);
						res[key] = getFamilyContent(key, content.next, snapshot, atoms);
					} else {
						content = getNewPrevContent(value, snapshot, previousSnapshot);
						res[key] = content.next;
					}

					if (content.isDiff) {
						hasChangesFromPrevious = true;
					}
				}

				return res;
			}, {});

		if (hasChangesFromPrevious) {
			try {
				localStorage.setItem(key, JSON.stringify(data));
			} catch (ex) {
				//TODO: replace with invariant/warning pkg
				console.warn("FAILED TO PERSIST RECOIL DATA TO LS", ex);
			}
		}
	});
};

export default useLocalStoragePersistence;
