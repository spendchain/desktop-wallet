import { Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import {
	act,
	env,
	getDefaultProfileId,
	RenderResult,
	renderWithRouter,
	waitFor,
} from "utils/testing-library";

import { WalletDetails } from "./WalletDetails";

let profile: Profile;
let wallet: Wallet;
const routes: string[] = [];

const renderPage = async () => {
	const history = createMemoryHistory();
	const registrationURL = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
	history.push(registrationURL);

	let rendered: RenderResult;

	await act(async () => {
		rendered = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletDetails />
			</Route>,
			{
				// routes,
				routes: [registrationURL],
				history,
			},
		);

		await waitFor(() => expect(rendered.getByTestId("WalletHeader")).toBeTruthy());
	});

	return {
		...rendered!,
		history,
	};
};

describe("Registration", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		await profile.wallets().importByAddress("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib", "ARK", "devnet");

		// for (const wallet of profile.wallets().values()) {
		// 	routes.push(`/profiles/${profile.id()}/transactions/${wallet.id()}/registration`);
		// }

		// copied from WalletDetails.test.tsx
		nock("https://dwallets.ark.io")
			.post("/api/transactions/search")
			.query(true)
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/transactions.json");
				return {
					meta,
					data: data.slice(0, 1),
				};
			})
			.persist();
	});

	// beforeEach(() => {
	// 	nock.cleanAll();
	// 	defaultNetMocks();
	// });

	it("should still render when route changes", async () => {
		const { asFragment, getByTestId, history, rerender } = await renderPage();

		await waitFor(() => expect(getByTestId("WalletHeader")).toBeTruthy());
		await waitFor(() => expect(asFragment()).toMatchSnapshot());

		for (const wallet of profile.wallets().values()) {
			history.push(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

			// rerender(<Route path="/profiles/:profileId/wallets/:walletId">
			// 	<WalletDetails />
			// </Route>);

			await waitFor(() => expect(getByTestId("WalletHeader")).toBeTruthy());
		}

		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});
});
