import { FC } from "react";
import { RecoilRootProps } from "recoil";
import { Spring } from "./spring";
import { StateInitializer } from "./common";

export type SpringCreator = () => Spring<any>;

export interface SpringRootProps extends Omit<RecoilRootProps, "initializeState"> {
	spring: Spring<any> | SpringCreator;
	initializer?: StateInitializer;
}

export const SpringRoot: FC<SpringRootProps>;
