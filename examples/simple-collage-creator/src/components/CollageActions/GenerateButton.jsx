import styled from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SaveIcon from "@mui/icons-material/Save";
// import { useCollageGenerator } from "../../state/setters";
import { useCanGenerate, useGenerating, useIsDarkMode } from "../../state/selectors";
import GutterCircleProgress from "../GutterCircleProgress";
import useAppTheme from "../../styles/useAppTheme";
import TooltipIconButton from "../TooltipIconButton";

const CheckList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  span {
    display: flex;
    gap: 8px;
  }
`;

const CantGenerateTooltipText = ({ report }) => {
	return (
		<CheckList>
			{report.checks.map(({ status, text }) =>
				<Typography
					key={text}
					variant="subtitle"
					color="success"
					sx={{ color: status ? "success.main" : "gray" }}
				>
					<CheckCircleIcon fontSize="small" color={status ? "success" : "gray"}/>
					{text}
				</Typography>)}
		</CheckList>
	);
};

const GeneratingProgress = styled(GutterCircleProgress)`
  svg {
    margin: 3px;
  }
`;

const GenerateButton = () => {
	// const generate = useCollageGenerator();
	const isGenerating = useGenerating();
	const canGenerateReport = useCanGenerate();
	const isDarkMode = useIsDarkMode();
	const theme = useAppTheme();

	const generate = () => {

	};

	return (
		isGenerating ?
			<Box sx={{ color: "action.active", margin: "0 15px" }}>
				<GeneratingProgress
					gutterColor={theme.palette.grey[isDarkMode ? 600 : 500]}
					color="inherit"
					size={44}
					thickness={4}
				/>
			</Box> :
			<TooltipIconButton
				onClick={generate}
				isDisabled={!canGenerateReport.result}
				tooltipOnDisabled
				tooltipTitle="To Generate: "
				tooltipText={<CantGenerateTooltipText report={canGenerateReport}/>}
				tooltipSeverity="warning"
				aria-label="generate collage"
				icon={<SaveIcon fontSize="large"/>}
			/>
	);
};

export default GenerateButton;
