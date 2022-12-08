import { useStateHistory } from "recoil-spring";
import atoms from "../store";

const {
	collageSize,
	width,
	borderColor,
	borderWidth,
	crop,
	gravity,
	collagePhotos,
} = atoms;

const historyAtoms = [
	collageSize,
	width,
	borderColor,
	borderWidth,
	crop,
	gravity,
	collagePhotos,
];

const useCollageHistory = () =>
	useStateHistory({ include: historyAtoms });

export default useCollageHistory;

