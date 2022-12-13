
export interface Spring<T> {
	atoms: T;
//   getAtoms, { keys of T, value is atom/atomFamily }
//   add: (name: string, defaultValue: unknown) => Spring<T>;
//   addFamily: () => Spring<T>;
}

export function createSpring<T>(defaults: Record<string, unknown>): Spring<T>;

export * from "./common";
export * from "./createSelectorHook";
