import { invariant, invariantAll } from "../index";

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
			invariant(null, "foo", undefined, false, "test");
		}).not.to.throw;
	});

	it("should throw when all checks are falsy ", () => {
		expect(() => {
			invariant(null, 0, undefined, false, "ya'll are nothing");
		}).to.throw("ya'll are nothing");
	});

	describe("invariantAll tests", () => {
		it("should not throw for all truthy", () => {
			expect(() => {
				invariantAll(1, true, "a", "test");
			}).not.to.throw;
		});

		it("should throw for some falsy", () => {
			expect(() => {
				invariantAll("1", true, false, "all or nothing");
			}).to.throw("all or nothing");
		});

		it("should throw all falsy", () => {
			expect(() => {
				invariantAll(undefined, "nope");
			}).to.throw("nope");
		});
	});
});
