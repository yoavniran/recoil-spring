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

	const itemsUpdaterSelector = createFamilyTrackerSelector(
		"itemsUpdaterTrackerSelector",
		spring.atoms.items,
		(ids, get) =>
			ids
				.map((id) => get(spring.atoms.items(id)))
				.filter((item) => item.pending)
	);

	const useItems = createFamilyTrackerSelectorHook(spring.atoms.items);

	const useItem = createSelectorFamilyHook(spring.atoms.items,
		(param, item, { set }) => {
			console.log("adding new item!", item);
			set(spring.atoms.items(param), { ...item, pending: true });
		});

	const Item = ({ id }) => {
		const [item] = useItem(id);

		return <li title={item.id}>
			{item.name} (status = {item.pending ? "Pending!" : `Done [${item.time}]`})
		</li>;
	};

	const ItemsList = ({ useItemsUpdater }) => {
		const items = useItems();
		useItemsUpdater();

		console.log("FOUND ITEMS !", items);

		return (
			<div>
				<h3>Found {items.length} items</h3>
				{items.map((id) =>
					<Item key={id} id={id}/>)}
			</div>
		);
	};

	const TestUI = ({ useItemsUpdater }) => {
		const createItem = useItem()[1];

		const onCreate = () => {
			const newId = uuid();

			createItem(newId, { id: newId, name: randomName() });
		};

		return (
			<>
				<button id="btn-create" onClick={onCreate}>Add Item</button>
				<br/>
				<ItemsList useItemsUpdater={useItemsUpdater}/>
			</>
		);
	};

	const getNewDataForItems = (items, delay) => {
		const initTime = performance.now();

		return new Promise((resolve) => setTimeout(() => {
			resolve(items.map((item) => ({
				...item,
				pending: false,
				updated: true,
				time: initTime
			})));
		}, delay));
	}

	it("should use debounce to reduce external calls", () => {
		const getNewDataForItemsSpy =
			cy.spy(getNewDataForItems)
				.as("debouncedSpy");

		const useDebouncedItemsUpdater = createReactiveSetterHook(
			itemsUpdaterSelector,
			async ({ set }, items) => {
				if (items.length) {
					const updated = await getNewDataForItemsSpy(items, 200);
					//new data will now get to the UI through the selector hook
					updated.forEach((item) => set(spring.atoms.items(item.id), item));
				}
			},
			{
				delay: 1000,
				debounce: true,
			},
		);

		cy.mountSpringRoot(<TestUI
			useItemsUpdater={useDebouncedItemsUpdater}
		/>, spring);

		cy.get("#btn-create")
			.click();
		cy.wait(100);

		cy.get("#btn-create")
			.click();
		cy.wait(100);

		cy.get("#btn-create")
			.click();
		cy.wait(400);

		cy.get("#btn-create")
			.click();
		cy.wait(100);

		cy.get("#btn-create")
			.click();

		cy.get("@debouncedSpy").should("have.been.calledOnce");
	});

	it("should use throttle to reduce external calls", () => {
		const getNewDataForItemsSpy =
			cy.spy(getNewDataForItems)
				.as("throttledSpy");

		const useNoSimulItemsUpdater = createReactiveSetterHook(
			itemsUpdaterSelector,
			async ({ set }, items) => {
				if (items.length) {
					const updated = await getNewDataForItemsSpy(items, 80);
					//new data will now get to the UI through the selector hook
					updated.forEach((item) => set(spring.atoms.items(item.id), item));
				}
			},
			{
				delay: 450,
				throttle: true,
			},
		);

		cy.mountSpringRoot(<TestUI
			useItemsUpdater={useNoSimulItemsUpdater}
		/>, spring);

		cy.get("#btn-create")
			.click();
		cy.wait(100);

		cy.get("#btn-create")
			.click();
		cy.wait(100);

		cy.get("#btn-create")
			.click();
		cy.wait(400);

		cy.get("#btn-create")
			.click();
		cy.wait(100);

		cy.get("#btn-create")
			.click();

		cy.get("@throttledSpy").should("have.been.calledThrice");
	});
});
