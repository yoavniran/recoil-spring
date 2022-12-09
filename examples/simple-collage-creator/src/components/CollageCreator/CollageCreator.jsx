import { Suspense } from "react";
import styled from "styled-components";
import Topbar from "../Topbar";
import AppDrawer from "../AppDrawer";
import Notifications from "../Notifications";
import CollageActions from "../CollageActions";
import CollagePhotos from "../CollagePhotos";
import UploadyConnector from "../UploadyConnector";
import PageSpinner from "../PageSpinner";
import CollageAddedList from "../CollageAddedList";

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

const CollageCreator = () => {
	return (
		<UploadyConnector>
				<Suspense fallback={<PageSpinner/>}>
					<Notifications/>
						<Topbar/>
						<AppContainer>
							<CollageActions/>
							<CollageAddedList/>
							<CollagePhotos/>
						</AppContainer>
						<AppDrawer/>
				</Suspense>
		</UploadyConnector>
	);
};

export default CollageCreator;
