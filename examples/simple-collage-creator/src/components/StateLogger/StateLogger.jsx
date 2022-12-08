import {
	isRecoilValue,
	useRecoilTransactionObserver_UNSTABLE as useRecoilTransactionObserver,
} from "recoil";
import atoms from "../../state";

const StateLogger = () => {
	useRecoilTransactionObserver(({ snapshot }) => {
		const data = Object.entries(atoms)
			.reduce((res, [key, value]) => {
				if (isRecoilValue(value)) {
					res[key] = snapshot.getLoadable(value).contents;
				}
				return res;
			}, {});

		console.log("### STATE WAS UPDATED ###");
		console.table(data, ["Value"]);
	});

	return null;
};

export default StateLogger;

