import { useEffect } from "react";
import { selector, atom } from "recoil";
import * as createSelector from "../createSelector";
import createGetSetHooks from "../createGetSetHooks";

describe("createGetSetHooks tests", () => {
	let createSelectorStub;

	before(() => {
		const testData = atom({ key: "test", default: 1 });
		const testSelector = selector({
			key: "testSelector",
			get: ({ get }) => get(testData),
			set: ({ set }, newVal) => {
				set(testData, newVal);
			},
		});

		createSelectorStub = stubProp(createSelector)
			.returns({ hookSelector: testSelector });
	});

	it("should create get and set hooks with generated key", async () => {
		const getter = atom({ key: "blabla" }),
			setter = "test selector",
			testParams = { test: true };

		const {
			useGetHook, useSetHook,
		} = createGetSetHooks(getter, setter, testParams);

		expect(createSelectorStub.calledOnceWith(
			getter,
			setter,
			"blablaSpringGetSetSelector",
			testParams,
		)).to.be.true;

		const { result: getHookResult } = recoilRenderHook(() => useGetHook());

		expect(getHookResult.current).to.eql(1);

		const { result: setHookResult } = recoilRenderHook(() => {
			const setVal = useSetHook();
			useEffect(() => {
				setVal(2);
			});

			return useGetHook();
		});

		expect(setHookResult.current).to.eql(2);
	});

});
