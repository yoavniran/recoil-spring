import { createSelectorHook } from "recoil-spring";
import atoms from "../store";

const {
	collageSize
} = atoms;

const useCollageSize = createSelectorHook(collageSize);

export default useCollageSize;
