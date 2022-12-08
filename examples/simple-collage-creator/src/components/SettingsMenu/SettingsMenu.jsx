import { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import { useMockUpload } from "../../state/selectors";
import IconButtonMenu from "../IconButtonMenu";
import SimpleSwitch from "../SimpleSwitch";


const SettingsMenu = () => {
	const [isMenuOpen, setMenuOpen] = useState(false);
	const [isDebug, setDebug] = useDebug();
	const [isMockUpload, setMockUpload] = useMockUpload();
	const isMonochromeGrid = useIsMonochromeGrid();
	// const calcCells = useGridCellsCalculator();

	const toggleDebug = () => setDebug(!isDebug);
	const toggleMockUpload = () => setMockUpload(!isMockUpload);

	return (
		<IconButtonMenu
			onOpenChange={setMenuOpen}
			closeOnClick={false}
			icon={<SettingsIcon
				fontSize="large"
				color={isMenuOpen ? "disabled" : undefined}
			/>}
			tooltipTitle="Settings"
		>
			<MenuItem>
				<FormControlLabel
					control={<SimpleSwitch checked={isDebug} onChange={toggleDebug} />}
					label="Debug"
				/>
			</MenuItem>
			<MenuItem>
				<FormControlLabel
					control={<SimpleSwitch checked={isMockUpload} onChange={toggleMockUpload} />}
					label="Mock Upload"
				/>
			</MenuItem>
		</IconButtonMenu>
	)
};

export default SettingsMenu;
