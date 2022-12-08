import { expect } from "chai";
import sinon from "sinon";
import { RecoilEnv } from "recoil";

global.expect = expect;
global.sinon = sinon;

global.stubProp = (obj, property = "default") => sinon.stub(obj, property);

afterEach(() =>{
	sinon.restore();
});

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;
