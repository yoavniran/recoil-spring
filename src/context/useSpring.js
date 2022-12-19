import { useContext } from "react";
import SpringContext from "./SpringContext";
import { invariant } from "../utils";

const useSpring = (initiator = null) => {
	const spring = useContext(SpringContext);

	if (initiator) {
		invariant(spring, `recoil:spring - couldn't find Spring instance from Context for ${initiator}`);
	}

	return spring;
};

export default useSpring;
