import { FC } from "react";
import { RecoilRootProps } from "recoil";
import { Spring } from "./spring";

export interface SpringRootProps extends Omit<RecoilRootProps, "initializeState"> {
	spring: Spring<any>;
	// initializer,
}

export const SpringRoot: FC<SpringRootProps>;
