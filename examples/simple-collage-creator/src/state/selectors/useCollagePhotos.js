import { createFamilyTrackerSelectorHook } from "recoil-spring";
import atoms from "../store";

const {
	collagePhotos,
} = atoms;

const useCollagePhotos = createFamilyTrackerSelectorHook(collagePhotos);

export default useCollagePhotos;

const collagePhotosSelector = useCollagePhotos.selector;

export {
	collagePhotosSelector,
};
