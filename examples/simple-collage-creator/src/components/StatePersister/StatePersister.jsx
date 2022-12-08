import { LS_KEY } from "../../consts";
import { useLocalStoragePersistence } from "recoil-spring";
import atoms from "../../state";

const {
	isAppDrawerOpen,
	notifications,
	uploads,
	isGenerating,
	collagePhotos,
} = atoms;

const ignores = [
	isAppDrawerOpen,
	notifications,
	uploads,
	isGenerating,
	collagePhotos,
];

const StatePersister = () => {
	useLocalStoragePersistence({
		key: LS_KEY,
		ignore: ignores,
	});

	return null;
};

export default StatePersister
