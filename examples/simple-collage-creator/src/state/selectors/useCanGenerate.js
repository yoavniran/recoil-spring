import isEmpty from "lodash/isEmpty";
import { createSelectorHook } from "recoil-spring";
import { GENERATE_REPORT_TYPES } from "../../consts";
import atoms from "../store";
import { allSlotsSetSelector } from "./useAllSlotsSet";

const {
	cloud,
	collagePreset,
} = atoms;

const useCanGenerate = createSelectorHook(
	"CanGenerateSelector",
	(get) => {
		const checks = [
			{
				type: GENERATE_REPORT_TYPES.CLOUD,
				text: "Set cloud name (menu)",
				status: !isEmpty(get(cloud)),
			},
			{
				type: GENERATE_REPORT_TYPES.PRESET,
				text: "Set collage preset (menu)",
				status: !isEmpty(get(collagePreset)),
			},
			{
				type: GENERATE_REPORT_TYPES.CELLS,
				text: "Set a photo for every slot",
				status: (get(allSlotsSetSelector)),
			},
		];

		return {
			result: checks.every(({ status }) => status),
			checks,
		};
	},
);

export default useCanGenerate;
