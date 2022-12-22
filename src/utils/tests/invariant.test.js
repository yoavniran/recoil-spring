import { invariant } from "../index";

describe("invariants tests", () => {
	it("should not throw for truthy", () => {
		expect(() => {
			invariant("a");
			invariant(true);
			invariant(1);
		}).not.to.throw;
	});

	it("should throw for falsy", () => {
		const a = null;
		expect(() => {
			invariant(a, "missing a");
		}).to.throw("missing a");

		const returnNothing = () => {
		};

		const b = returnNothing();

		expect(() => {
			invariant(b, "got nothing back");
		}).to.throw("got nothing back");
	});

	it("should not throw when some checks are falsy", () => {
		expect(() => {
			invariant(null, "foo", undefined, false);
		}).not.to.throw;
	});

	it("should throw when all checks are falsy ", () => {
		expect(() => {
			invariant(null, 0, undefined, false, "ya'll are nothing");
		}).to.throw("ya'll are nothing");
	});
});
