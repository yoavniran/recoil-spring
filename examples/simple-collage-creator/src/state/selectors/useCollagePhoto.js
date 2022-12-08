import { createSelectorFamilyHook } from "recoil-spring";
import atoms from "../store";
import isNil from "lodash/isNil";
import { collagePhotosSelector } from "./useCollagePhotos";

const {
	collageSize,
	collagePhotos,
} = atoms;

const useCollagePhoto = createSelectorFamilyHook(
	collagePhotos,
	(param, { photo, options = {} }, { set, reset, get }) => {
		if (photo === null) {
			reset(collagePhotos(param));
		} else if (!isNil(param)) {
			set(collagePhotos(param), photo);
		} else {
			const size = get(collageSize),
				trackedPhotos = get(collagePhotosSelector);

			const slots = Math.pow(size, 2) - trackedPhotos.length;

			if (slots > 0) {
				const photos = [].concat(photo).slice(0, slots);

				photos.forEach((p, index) => {
					//add photo to first open slot
					set(collagePhotos(trackedPhotos.length + index), p);
				});
			}
		}
	},
);

export default useCollagePhoto;
