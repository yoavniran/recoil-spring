import styled from "styled-components";
import { UploadPreview } from "@rpldy/upload-preview";
import MenuItem from "@mui/material/MenuItem";
import BurstModeIcon from "@mui/icons-material/BurstMode";
import ResizableBottomContainer from "../ResizableBottomContainer";
import EmptyCard from "./EmptyCard";
import UploadingCard from "./UploadingCard";
import UploadPhotoCard from "./UploadPhotoCard";
import { usePhotos, usePhotosDrawerHeight } from "../../state/selectors";
import { useFillSlots } from "../../state/setters";
import IconButtonMenu from "../IconButtonMenu";

const MIN_CONTAINER_HEIGHT = 14;

const StyledResizableBottomContainer = styled(ResizableBottomContainer)`
	
`;

const PhotosContainer = styled.div`
  padding: 12px 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
`;

const StyledIconButtonMenu = styled(IconButtonMenu)`
	position: absolute;
	right: 2px;
	top: 10px;
	
	
`;

const CollagePhotos = () => {
	const photos = usePhotos();
	const [drawerHeight, setDrawerHeight] = usePhotosDrawerHeight();
	const fillSlots = useFillSlots();

	const onUsePhotos = () => {
		fillSlots();
	};

	return (
		<StyledResizableBottomContainer
			minHeight={MIN_CONTAINER_HEIGHT}
			height={drawerHeight}
			setHeight={setDrawerHeight}
		>
			<PhotosContainer sx={{ height: "100%" }}>
				<EmptyCard/>
				<UploadPreview
					rememberPreviousBatches
					PreviewComponent={UploadingCard}
				/>
				{photos.map((photoId) =>
					<UploadPhotoCard key={photoId} id={photoId}/>)}
			</PhotosContainer>
			<StyledIconButtonMenu>
				<MenuItem onClick={onUsePhotos} disabled={!photos.length}>
					<BurstModeIcon /> Use Photos
				</MenuItem>
			</StyledIconButtonMenu>
		</StyledResizableBottomContainer>
	);
};

export default CollagePhotos;

