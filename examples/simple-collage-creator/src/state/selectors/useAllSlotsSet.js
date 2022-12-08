import { createSelectorHook } from "recoil-spring";
import atoms from "../store";

const {
	collagePhotos,
	collageSize
} = atoms;

const useAllSlotsSet = createSelectorHook(
	"useAllSlotsSetSelector",
	(get, getTracker) => {
		const photos = getTracker(collagePhotos),
			size = get(collageSize);

		return photos.length === Math.pow(size, 2);
	}
);

export default useAllSlotsSet;

const allSlotsSetSelector = useAllSlotsSet.selector;

export {
	allSlotsSetSelector,
};
