import { FC, ComponentType } from "react";
import { RecoilRootProps } from "recoil";
import { Spring } from "./spring";
// import * as React from "react";

export interface SpringRootProps extends Omit<RecoilRootProps, "initializeState"> {
	spring: Spring<any>;
	// initializer,
}

export const SpringRoot: FC<SpringRootProps>;

// export type SpringRoot<T> = ComponentType<SpringRootProps<T>>;
// export const SpringRoot: <T>(props: SpringRootProps<T>) => FC<RecoilRootProps<T>>
//  React.FC<SpringRootProps<T>>;
