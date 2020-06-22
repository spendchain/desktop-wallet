import { render } from "@testing-library/react";
import React from "react";

import { PluginHeader } from "./PluginHeader";

describe("PluginHeader", () => {
	it("should render properly", () => {
		const { asFragment, getByRole } = render(
			<PluginHeader
				author="ARK Ecosystem"
				category="Utility"
				url="github.com"
				rating="4.6"
				version="1.3.8"
				size="4.2"
			/>,
		);

		expect(getByRole("img")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
