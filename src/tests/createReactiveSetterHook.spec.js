import React from "react";
import { v4 as uuid } from "uuid";
import randomName from "random-name";
import createSpring from "../spring";
import { springFamily } from "../springTypes";
import {
	createFamilyTrackerSelector,
	createFamilyTrackerSelectorHook,
	createSelectorFamilyHook,
} from "../family";
import { createReactiveSetterHook } from "../createReactiveSetterHook";


describe("createReactiveSetterHook tests", () => {
	const spring = createSpring({
		[springFamily("items")]: null,
	});

	// const itemsSelector = createFamilyTrackerSelector(
	// 	"itemsUpdaterTrackerSelector",
	// 	spring.atoms.items,
	// 	(trackerData, get) => {
	// 		console.log("TRACKER DATA RETRIEVED !!!! ", trackerData);
	// 		return trackerData.map((id) => get(spring.atoms.items(id)));
	// 	},
	// );
	//
	// const useItemsUpdater = createReactiveSetterHook(
	// 	itemsSelector,
	// 	100,
	// 	(actions, ...params) => {
	// 		console.log("!!!!!!!! ITEMS UPDATED CALLED !!! ", { actions, params });
	// 	},
	// );


	const useItems = createFamilyTrackerSelectorHook(spring.atoms.items);

	const useItem = createSelectorFamilyHook(spring.atoms.items,
		(param, item, { set, reset }) => {
			console.log("adding new item!", item);
			set(spring.atoms.items(param), { ...item, pending: true });
		});

	const Item = ({ id }) => {
		const [item] = useItem(id);

		return <li title={item.id}>
			{item.name} (status = {item.pending ? "Pending!" : "Done"})
		</li>;
	};

	const ItemsList = () => {
		const items = useItems();
		// useItemsUpdater();

		console.log("FOUND ITEMS !", items);

		return (
			<div>
				<h3>Found {items.length} items</h3>
				{items.map((id) =>
					<Item key={id} id={id}/>)}
			</div>
		);
	};

	const TestUI = () => {
		const createItem = useItem()[1];

		const onCreate = () => {
			const newId = uuid();

			createItem(newId, { id: newId, name: randomName() });
		};

		return (
			<>
				<button onClick={onCreate}>Add Item</button>
				<br/>
				<ItemsList/>
			</>
		);
	};

	it("should issue request every time a new item is added", () => {

		cy.mountSpringRoot(<TestUI/>, spring);
	});


});
