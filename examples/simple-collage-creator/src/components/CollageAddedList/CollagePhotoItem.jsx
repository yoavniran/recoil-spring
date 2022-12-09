import { memo } from "react";
import styled from "styled-components";
import Paper from "@mui/material/Paper";
import { useCollagePhoto } from "../../state/selectors";
import { addUrlTransformation } from "../../utils";
import Typography from "@mui/material/Typography";
import TooltipIconButton from "../TooltipIconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemPaper = styled(Paper)`
  height: 140px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;

  img {
    height: 120px;
    width: 160px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    object-fit: cover;
  }
`;

const CollagePhotoItem = memo(({ index }) => {
	const [photo, removePhoto] = useCollagePhoto(index);

	const onRemove = () => {
		removePhoto(index, { photo: null });
	};

	return (
		<ItemPaper elevation={4}>
			<img src={addUrlTransformation(photo.url, "$&/h_300,dpr_2,g_auto,c_fill/")}/>
			<Typography variant="h5">{photo.cldId}</Typography>
			<TooltipIconButton
				onClick={onRemove}
				tooltipText="Remove photo"
				tooltipDelay={1000}
				icon={<DeleteIcon/>}
				size="large"
			/>
		</ItemPaper>
	);
});

export default CollagePhotoItem;
