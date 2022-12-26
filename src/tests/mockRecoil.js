import * as recoil from "recoil";

beforeEach(() => {
	stubProp(recoil, "selector")
		.returns({ helpers: true });
});
