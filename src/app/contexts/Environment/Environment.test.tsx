import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { EnvironmentProvider, useEnvironment } from "./Environment";

describe("Environment Context", () => {
	it("should render the wrapper properly", () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		const { container, asFragment, getByText } = render(
			<EnvironmentProvider env={env}>
				<span>Provider testing</span>
			</EnvironmentProvider>,
			{},
		);

		expect(getByText("Provider testing")).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should rerender components when env updates", async () => {
		const env = new Environment({ coins: {}, httpClient, storage: new StubStorage() });

		const Details = () => {
			const env = useEnvironment();
			const count = env?.profiles().all().length;
			return <h1>Counter {count}</h1>;
		};

		const Create = () => {
			const env = useEnvironment();

			const handleClick = () => {
				env?.profiles().create("Test");
				env?.persist();
			};

			return <button onClick={handleClick}>Create</button>;
		};

		const App = () => {
			return (
				<EnvironmentProvider env={env}>
					<Details />
					<Create />
				</EnvironmentProvider>
			);
		};

		const { getByRole } = render(<App />, {});

		act(() => {
			fireEvent.click(getByRole("button"));
		});

		expect(env.profiles().all()).toHaveLength(1);
		await waitFor(() => expect(getByRole("heading")).toHaveTextContent("Counter 1"));
	});
});
