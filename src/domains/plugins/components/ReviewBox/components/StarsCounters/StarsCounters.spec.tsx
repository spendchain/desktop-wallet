import { render } from "@testing-library/react";
import React from "react";

import { StarsCounters } from "./StarsCounters";

describe("StarsCounters", () => {
	const ratings = [
		{
			rating: 5,
			votes: 156,
		},
		{
			rating: 4,
			votes: 194,
		},
		{
			rating: 3,
			votes: 25,
		},
		{
			rating: 2,
			votes: 42,
		},
		{
			rating: 1,
			votes: 7,
		},
	];

	it("should render properly", () => {
		const { asFragment } = render(<StarsCounters ratings={ratings} totalAvaliations={347} />);

		expect(asFragment()).toMatchSnapshot();
	});
});
