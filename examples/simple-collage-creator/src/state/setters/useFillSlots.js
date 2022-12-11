import { createTransactionHook } from "recoil-spring";
import atoms from "../store";

const {
	collagePhotos,
	notifications,
	photos,
} = atoms;

const useFillSlots = createTransactionHook((
	{ get, getTracker, set },
	config,
) => {
	set(notifications, (prev) => [{
		type: NOTIFICATION_TYPES.FILL_GRID,
		severity: "info",
		message: "Filling empty grid cells",
	}, ...prev]);
});

export default useFillSlots;
