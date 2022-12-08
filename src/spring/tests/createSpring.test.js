import { isRecoilValue,  } from "recoil";
import createSpring from "../createSpring";
import { springFamily } from "../../springTypes";
import * as getSpringHelpers from "../getSpringHelpers";

describe("createSpring tests", () => {
	beforeEach(() => {
		stubProp(getSpringHelpers).returns({ helpers: true });
	});

	it("should create spring using object map", () => {
		const { getAtomsData, helpers } = createSpring({
			test: true,
			foo: "bar",
		});

		const { atoms, metadata } = getAtomsData();

		expect(isRecoilValue(atoms.test)).to.be.true;
		expect(isRecoilValue(atoms.foo)).to.be.true;

		expect(metadata.foo.isFamily).to.be.false;

		expect(helpers).to.be.true;
	});

	it("should create spring with atom family and tracker", () => {
		const { getAtomsData } = createSpring({
			[springFamily("photos")]: null,
		});

		const { atoms, metadata } = getAtomsData();

		expect(atoms.photos).to.be.a("Function");
		expect(metadata.photos.isFamily).to.be.true;
		expect(metadata.photos.tracker).to.exist;
		expect(metadata[metadata.photos.tracker].isTracker).to.be.true;
		expect(isRecoilValue(atoms[metadata.photos.tracker])).to.be.true;
	});

	it("should create spring using chaining add calls", () => {
		const { getAtomsData } = createSpring()
			.add("test", true)
			.add(springFamily("photos"));

		const { atoms, metadata } = getAtomsData();

		expect(isRecoilValue(atoms.test)).to.be.true;
		expect(atoms.photos).to.be.a("Function");
		expect(metadata.photos.isFamily).to.be.true;
		expect(metadata.photos.tracker).to.exist;
		expect(metadata[metadata.photos.tracker].isTracker).to.be.true;
		expect(isRecoilValue(atoms[metadata.photos.tracker])).to.be.true;
	});

});
