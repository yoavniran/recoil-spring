import { createTransactionHook } from "recoil-spring";
import { NOTIFICATION_TYPES } from "../../consts";
import atoms from "../store";

const {
	collageSize,
	borderColor,
	borderWidth,
	collagePhotos,
	notifications,
} = atoms;

const useCollageReset = createTransactionHook(({ set, reset, resetFamily }) => {
		reset(collageSize);
		reset(borderColor);
		reset(borderWidth);
		resetFamily(collagePhotos);

		set(notifications, (prev) => [{
			type: NOTIFICATION_TYPES.COLLAGE_RESET,
			severity: "info",
			message: "Collage was reset",
		}, ...prev]);
});

export default useCollageReset;
