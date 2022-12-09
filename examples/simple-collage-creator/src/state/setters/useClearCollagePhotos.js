import { createSetterHook } from "recoil-spring";
import atoms from "../store";

const {
	collagePhotos,
} = atoms;

const useClearCollagePhotos = createSetterHook(({ resetFamily }) => {
	resetFamily(collagePhotos);
});

export default useClearCollagePhotos;
