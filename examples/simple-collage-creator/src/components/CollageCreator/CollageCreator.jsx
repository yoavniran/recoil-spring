import { Suspense } from "react";
import styled from "styled-components";
import Container from "@mui/material/Container";
// import { DndProvider } from "react-dnd";
import Topbar from "../Topbar";
import AppDrawer from "../AppDrawer";
import Notifications from "../Notifications";
import CollageActions from "../CollageActions";
// import CollageFloatingMenu from "../CollageFloatingMenu";
import CollagePhotos from "../CollagePhotos";
import UploadyConnector from "../UploadyConnector";
// import CollageUploadDropZone from "../CollageUploadDropZone";
import PageSpinner from "../PageSpinner";
import CollageAddedList from "../CollageAddedList";
// import InfoPopup from "../InfoPopup";

const AppContainer = styled.div`
	position: relative;
  width: 100%;
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;

  ${({ theme }) => theme.breakpoints.down("lg")} {
    padding: 0 10px;
  }
`;

// const StyledInfoPopup = styled(InfoPopup)`
// 	position: absolute;
// 	bottom: 0;
// 	right: 4px;
// `;

const CollageCreator = () => {
	return (
		<UploadyConnector>
				<Suspense fallback={<PageSpinner/>}>
					<Notifications/>
						<Topbar/>
						<AppContainer>
							<CollageActions/>
							<Container maxWidth="xl" sx={{ display: "flex", pb: 50, position: "relative" }}>
								<CollageAddedList/>
								{/*<CollageFloatingMenu/>*/}
								{/*<StyledInfoPopup/>*/}
							</Container>
							<CollagePhotos/>
						</AppContainer>
						<AppDrawer/>
				</Suspense>
		</UploadyConnector>
	);
};

export default CollageCreator;
