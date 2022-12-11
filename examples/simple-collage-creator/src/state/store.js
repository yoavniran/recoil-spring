import { createSpring, springFamily } from "recoil-spring";
import { CROP_TYPES, GRAVITY_TYPES } from "../consts";
import { THEME_MODES } from "../styles/theme";

const DEFAULTS = {
	//grid properties
	collageSize: 3,
	borderColor: "#000",
	borderWidth: 1,
	width: 900,
	height: 900,

	//collection of photos added to the collage
	[springFamily("collagePhotos")]: null,

	//settings
	cloud: "",
	collagePreset: "",
	uploadPreset: "",
	isSamePreset: true,
	crop: CROP_TYPES[0],
	gravity: GRAVITY_TYPES[0],

	//ui state
	themeMode: THEME_MODES.DARK,
	photosDrawerHeight: 0,
	notifications: [],
	isAppDrawerOpen: false,
	isGenerating: false,

	//debug options
	isMockUpload: false,

	//collections of uploads that turn into photos for the collage
	[springFamily("uploads")]: null,
	[springFamily("photos")]: null,
};

const spring = createSpring({ ...DEFAULTS });

const atoms = spring.atoms;

export default atoms;

console.log("Collage Store Atoms --------- ", atoms);

export {
	DEFAULTS,
	spring,
};

