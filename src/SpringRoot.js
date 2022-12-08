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

	return (
		<RecoilRoot
			initializeState={({ set }) => initializer({ set, spring: springUsed })}
			{...recoilProps}
		>
			<SpringContext.Provider value={springUsed}>
				{children}
			</SpringContext.Provider>
		</RecoilRoot>
	);
};

export default SpringRoot;
