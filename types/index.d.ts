export interface Spring<T> {
//   getAtomsData: () => { } ≈
//   getAtoms, { keys of T, value is atom/atomFamily }
//   add: (name: string, defaultValue: unknown) => Spring<T>;
//   addFamily: () => Spring<T>;
}

export type createSpring<T> = (definitions: T) => Spring<T>
