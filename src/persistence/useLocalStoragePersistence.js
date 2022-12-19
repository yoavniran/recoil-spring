import { useRecoilTransactionObserver_UNSTABLE as useRecoilTransactionObserver } from "recoil";
import { useSpring } from "../context";
import { warn } from "../utils";

//TODO: support include list (not just ignore)

const getIsTrackedIgnored = (key, ignore, spring) => {
	const atomMetadata = spring.getMetadata(key),
		 trackedName = atomMetadata.isTracker && atomMetadata.tracked;

	return trackedName &&
		(ignore.includes(trackedName) || ignore.includes(spring.getAtom(trackedName)));
};

const getIsIgnored = (key, value, ignore, spring)  => {
	return ignore.includes(key) ||
		ignore.includes(value) ||
		getIsTrackedIgnored(key, ignore, spring);
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

const getFamilyContent = (key, trackerIds, snapshot, spring) => {
	const family = spring.getAtom(key);

	return trackerIds.reduce((res, id) => {
		res[id] = snapshot.getLoadable(family(id)).contents;
		return res;
	}, {});
};

const useLocalStoragePersistence = ({ key, ignore }) => {
	const spring = useSpring("LocalStorage Persistence");

	useRecoilTransactionObserver(({ snapshot, previousSnapshot }) => {
		let hasChangesFromPrevious = false;

		const data = spring.getAtomsEntries()
			.reduce((res, [key, value]) => {
				if (!ignore || !getIsIgnored(key, value, ignore, spring)) {
					let content;

					const atomMetadata = spring.getMetadata(key);
					if (atomMetadata.isFamily) {
						//use tracker to persist family data
						//const trackerName = atomMetadata.tracker;
						const trackerAtom = spring.getTrackerAtom(key);
						content = getNewPrevContent(trackerAtom, snapshot, previousSnapshot);
						res[key] = getFamilyContent(key, content.next, snapshot, spring);
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
				warn("FAILED TO PERSIST RECOIL DATA TO LS", ex);
			}
		}
	});
};

export default useLocalStoragePersistence;
