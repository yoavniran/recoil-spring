import React from "react";
import "global-jsdom/register";
import { render, renderHook } from "@testing-library/react";
import { expect } from "chai";
import sinon, { stub, restore as sinonRestore } from "sinon";
import { RecoilEnv, RecoilRoot } from "recoil";

global.expect = expect;
global.sinon = sinon;

global.stubProp = (obj, property = "default") => stub(obj, property);

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const RecoilWrapper = ({ children }) => {
	return (
		<RecoilRoot>
			{children}
		</RecoilRoot>
	);
};

global.recoilRender = (ui, options) =>
	render(ui, { wrapper: RecoilWrapper, ...options });

global.recoilRenderHook = (ui, options) =>
	renderHook(ui, { wrapper: RecoilWrapper, ...options });

export const mochaHooks = {
	afterEach: () => {
		sinonRestore();
	},
};
