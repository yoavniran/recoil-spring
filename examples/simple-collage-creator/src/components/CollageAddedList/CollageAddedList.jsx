import styled from "styled-components";
import Stack from "@mui/material/Stack";
import { useCollagePhoto, useCollagePhotos } from "../../state/selectors";

const CollageAddedList = ({}) => {
	const photos = useCollagePhotos();

	console.log("PHOTOS !!!! ", photos);

	return null;
};

export default CollageAddedList;
