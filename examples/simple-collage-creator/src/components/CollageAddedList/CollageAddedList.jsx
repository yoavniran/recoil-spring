import styled from "styled-components";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useCollagePhotos, useCollageSize } from "../../state/selectors";
import CollagePhotoItem from "./CollagePhotoItem";
import TooltipIconButton from "../TooltipIconButton";
import useClearCollagePhotos from "../../state/setters/useClearCollagePhotos";

const CollageStack = styled(Stack)`
  width: 80%;
  max-width: 1200px;
  gap: 10px;
  padding-bottom: 60px;
`;

const ListTitle = styled(Paper)`
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 20px;
  gap: 20px;

  h5 {
    color: ${({ theme, $onTarget }) => $onTarget ?
            theme.palette.success.main :
            theme.palette.error.light};
  }
`;

const CollageAddedList = ({}) => {
	const photos = useCollagePhotos();
	const [collageSize] = useCollageSize();
	const target = Math.pow(collageSize, 2);
	const isOnTarget = target === photos.length;
	const clearCollagePhotos = useClearCollagePhotos();

	const onClear = () => {
		clearCollagePhotos();
	};

	return (
		<CollageStack>
			<ListTitle $onTarget={isOnTarget}>
				<Typography variant="h5">{photos.length} / {target}</Typography>
				<TooltipIconButton
					onClick={onClear}
					icon={<ClearAllIcon fontSize="medium"/>}
					tooltipTitle="Clear all photos"
					isDisabled={!photos.length}
					tooltipSimple
				/>
			</ListTitle>
			{photos.map((index) =>
				<CollagePhotoItem
					key={`${photos.length}-${index}`}
					index={index}
				/>)}
		</CollageStack>
	);
};

export default CollageAddedList;
