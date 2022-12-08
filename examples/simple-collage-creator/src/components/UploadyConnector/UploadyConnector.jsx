import { useEffect } from "react";
import Uploady, {
	useRequestPreSend,
	useUploady,
} from "@rpldy/uploady";
import { useUploadDetails } from "../../state/selectors";
import useUploadyItemMonitor from "../hooks/useUploadyItemMonitor";
import useUploadyEnhancers from "./useUploadyEnhancers";

const UploadyConfig = () => {
	const { cloud, preset } = useUploadDetails() || {};
	const { setOptions } = useUploady();

	useEffect(() => {
		setOptions({
			fileFilter: (file) => file.type.startsWith("image/"),
		});
	}, []);

	useRequestPreSend(() => {
		return {
			options: {
				destination: {
					url: `https://api.cloudinary.com/v1_1/${cloud}/upload`,
					params: {
						upload_preset: preset,
					},
				},
			},
		};
	});

	useUploadyItemMonitor();

	return null;
};

const UploadyConnector = ({ children }) => {
	const uploadyEnhancers = useUploadyEnhancers();

	return (
		<Uploady
			debug
			concurrent
			maxConcurrent={5}
			accept="image/*"
			enhancer={uploadyEnhancers}
		>
			<UploadyConfig/>
			{children}
		</Uploady>
	);
};

export default UploadyConnector;
