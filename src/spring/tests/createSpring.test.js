import { isRecoilValue,  } from "recoil";
import createSpring from "../createSpring";
import { springFamily } from "../../springTypes";

describe("createSpring tests", () => {
	// beforeEach(() => {
		// stubProp(getSpringHelpers).returns({ helpers: true });
	// });

	it("should create spring using object map", () => {
		const spring = createSpring({
			test: true,
			foo: "bar",
		});

		expect(isRecoilValue(spring.getAtom("test"))).to.be.true;
		expect(isRecoilValue(spring.getAtom("foo"))).to.be.true;

		expect(spring.getMetadata("foo").isFamily).to.be.false;

		expect(isRecoilValue(spring.atoms.test)).to.be.true;
		expect(isRecoilValue(spring.atoms.foo)).to.be.true;
	});

	it("should create spring with atom family and tracker", () => {
		const { atoms, getMetadata } = createSpring({
			[springFamily("photos")]: null,
		});

		expect(atoms.photos).to.be.a("Function");
		expect(getMetadata("photos").isFamily).to.be.true;
		expect(getMetadata("photos").tracker).to.exist;
		expect(getMetadata(getMetadata("photos").tracker).isTracker).to.be.true;
		expect(isRecoilValue(atoms[getMetadata("photos").tracker])).to.be.true;
	});

	it("should create spring using chaining add calls", () => {
		const { atoms, getMetadata } = createSpring()
			.add("test", true)
			.add(springFamily("photos"), null)
			.addFamily("uploads", { });

		expect(isRecoilValue(atoms.test)).to.be.true;
		expect(atoms.photos).to.be.a("Function");
		expect(getMetadata("photos").isFamily).to.be.true;
		expect(getMetadata("photos").tracker).to.exist;
		expect(getMetadata(getMetadata("photos").tracker).isTracker).to.be.true;
		expect(isRecoilValue(atoms[getMetadata("photos").tracker])).to.be.true;

		expect(atoms.uploads).to.be.a("Function");
	});

	describe("readonly atoms map tests", () => {
		it("should be possible to list atoms in map", () => {
			const spring = createSpring({
				test: true,
				foo: "bar"
			});

			expect(Object.values(spring.atoms).length).to.eql(2);

			Object.values(spring.atoms).forEach((atom) => {
				expect(isRecoilValue(atom)).to.be.true;
			});
		});

		it("should not be possible to reassign", () => {
			const spring = createSpring({
				test: true,
			});

			expect(() => {
				spring.atoms.test = "123";
			}).to.throw("Cannot redefine property: test");
		});

		it("should not be possible to delete", () => {
			const spring = createSpring({
				test: true,
			});

			delete spring.atoms.test;
			expect(isRecoilValue(spring.atoms.test)).to.be.true;
		});

		it("should be available in map after add call", () => {
			const spring = createSpring();

			expect(isRecoilValue(spring.atoms.test)).to.be.false;

			spring.add("test", "123");

			expect(isRecoilValue(spring.atoms.test)).to.be.true;
		});
	});
});
