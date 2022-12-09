import { createSelectorFamilyHook } from "recoil-spring";
import isNil from "lodash/isNil";
import atoms from "../store";
import { collagePhotosSelector } from "./useCollagePhotos";

const {
	collageSize,
	collagePhotos,
} = atoms;

const useCollagePhoto = createSelectorFamilyHook(
	collagePhotos,
	(param, { photo, options = {} } = {}, { set, reset, get }) => {
		if (photo === null) {
			reset(collagePhotos(param));
		} else if (!isNil(param)) {
			set(collagePhotos(param), photo);
		} else {
			const size = get(collageSize),
				trackedPhotos = get(collagePhotosSelector),
				slots = Math.pow(size, 2) - trackedPhotos.length;

			if (slots > 0) {
				const photos = [].concat(photo).slice(0, slots);

				photos.forEach((p, index) => {
					//add photo to first open slot
					set(collagePhotos((trackedPhotos[trackedPhotos.length - 1] || 0) + index + 1 ), p);
				});
			}
		}
	},
);

export default useCollagePhoto;
