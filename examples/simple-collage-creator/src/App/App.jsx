import { SpringRoot, getLocalStorageInitializer } from "recoil-spring";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "../styles/GlobalStyles";
import { LS_KEY } from "../consts";
import { spring } from "../state";
import AppThemeProvider from "../styles/AppThemeProvider";
import CollageCreator from "../components/CollageCreator";
import StateLogger from "../components/StateLogger";
import StatePersister from "../components/StatePersister";

const initializeRecoil = getLocalStorageInitializer({
	key: LS_KEY,
});

const App = () => {
	return (
		<SpringRoot
			spring={spring}
			initializer={initializeRecoil}
		>
			<StateLogger/>
			<StatePersister/>
			<AppThemeProvider>
				<CssBaseline/>
				<GlobalStyles/>
				<CollageCreator/>
			</AppThemeProvider>
		</SpringRoot>
	);
};

export default App;
