import React, { FC, PropsWithChildren } from "react";
import { SpringRoot, useStateHistory, createSelectorHook, createSetterHook } from "recoil-spring";
import { HexColorPicker } from "react-colorful";
import spring, { atoms } from "./spring";

const historyAtoms = [
	atoms.age,
	atoms.name,
];

const useStoryHistory = () =>
	useStateHistory({ include: historyAtoms });

const useAge = createSelectorHook<number>(
	atoms.age,
	(newVal, { set }) => {
		if (newVal > 0) {
			set(atoms.age, newVal);
		}
	});

const useColor = createSelectorHook<string>(atoms.color);

const useName = createSelectorHook<string>(atoms.name);

const useReset = createSetterHook(({ reset }) => {
	reset(atoms.age);
	reset(atoms.name);
	reset(atoms.color);
});

const HistoryButtons: FC = () => {
	const {
		goBack,
		goForward,
		nextCount,
		previousCount,
	} = useStoryHistory();

	return (
		<div style={{ display: "flex", gap: 10, justifyContent: "space-around" }}>
			<button id="history-back" onClick={goBack} disabled={previousCount === 0 || undefined}>
				back ({previousCount})
			</button>
			<button id="history-forward" onClick={goForward} disabled={nextCount === 0 || undefined}>
				forward ({nextCount})
			</button>
		</div>
	);
};

const Field: FC<PropsWithChildren<{ name: string }>> = ({ name, children }) => {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
			<label>{name}: </label>
			{children}
		</div>
	);
};

const AgeField = () => {
	const [ age, setAge ] = useAge();

	return (
		<Field name="Age">
			<input
				id="age-field"
				value={age}
				type="number"
				onChange={(e) => setAge(parseInt(e.target.value))}
			/>
		</Field>
	);
};

const NameField = () => {
	const [ name, setName ] = useName();

	return (
		<Field name="Name">
			<input
				id="name-field"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
		</Field>
	);
};

const Container: FC<PropsWithChildren<{}>> = ({ children }) => {
	const [ color ] = useColor();

	return (
		<div
			style={{
				width: "500px",
				display: "flex",
				flexDirection: "column",
				gap: 20,
				border: `4px solid ${color}`,
				padding: "10px",
			}}>
			{children}
		</div>
	);
};

const ColorField = () => {
	const [ color, setColor ] = useColor();

	return (
		<Field name="Color">
			<HexColorPicker id="color-field" color={color} onChange={setColor}/>
			<br/>
			<span id="color-value">{color}</span>
		</Field>
	);
};

const ResetButton = () => {
	const reset = useReset();
	return <button onClick={reset}>RESET</button>;
};

export const Simple: FC = () => {
	return (
		<SpringRoot spring={spring}>
			<Container>
				<HistoryButtons/>

				<NameField/>
				<AgeField/>
				<ColorField/>
				<ResetButton/>
			</Container>
		</SpringRoot>
	);
};


export default {
	title: "history",
};
