import React from "react";
import { RecoilRoot } from "recoil";
import { isFunction } from "./utils";
import SpringContext from "./context";

const SpringRoot = ({
	                    spring,
	                    initializer,
	                    children,
	                    ...recoilProps
                    }) => {
	const springUsed = isFunction(spring) ? spring() : spring;

	const initState = initializer ?
		(snapshot) => initializer({ snapshot, spring: springUsed }) : undefined;

	return (
		<RecoilRoot
			// eslint-disable-next-line react/jsx-no-bind
			initializeState={initState}
			{...recoilProps}
		>
			<SpringContext.Provider value={springUsed}>
				{children}
			</SpringContext.Provider>
		</RecoilRoot>
	);
};

export default SpringRoot;
