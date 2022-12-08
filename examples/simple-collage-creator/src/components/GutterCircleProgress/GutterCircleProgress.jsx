import CircularProgress from "@mui/material/CircularProgress";

const GutterCircleProgress = ({ gutterColor, color, ...props }) => {
	return (
		<>
			<CircularProgress
				{...props}
				variant="determinate"
				sx={{
					position: "absolute",
					color: gutterColor,
				}}
				value={100}
			/>
			<CircularProgress
				variant="indeterminate"
				disableShrink
				{...props}
				color={color}
			/>
		</>
	);
};

export default GutterCircleProgress;
