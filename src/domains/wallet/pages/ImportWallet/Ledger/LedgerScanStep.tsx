import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Network } from "@arkecosystem/platform-sdk/dist/coins";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Checkbox } from "app/components/Checkbox";
import { Circle } from "app/components/Circle";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Spinner } from "app/components/Spinner";
import { Table, TableCell, TableRow } from "app/components/Table";
import { useLedgerContext } from "app/contexts";
import { LedgerData, useLedgerScanner } from "app/contexts/Ledger";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

const AmountWrapper = ({
	isFailed,
	isLoading,
	children,
}: {
	isFailed: boolean;
	isLoading: boolean;
	children: React.ReactNode;
}) => {
	const { t } = useTranslation();

	if (isLoading) {
		return <Skeleton width={60} height={16} />;
	}

	if (isFailed) {
		return (
			<div className="flex items-center space-x-3 text-theme-danger-400">
				<Circle className="border-theme-danger-400" noShadow size="sm">
					<Icon name="CrossSlim" />
				</Circle>
				<span>{t("COMMON.ERROR")}</span>
			</div>
		);
	}

	return <div>{children}</div>;
};

export const LedgerTable = ({
	network,
	wallets,
	selectedWallets,
	isSelected,
	isLoading,
	isFailed,
	toggleSelect,
	toggleSelectAll,
}: {
	network: Network;
} & ReturnType<typeof useLedgerScanner>) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: "Wallet",
			accessor: "address",
		},
		{
			Header: "Balance",
			accessor: "balance",
		},
		{
			Header: (
				<Tippy content={t("COMMON.SELECT_ALL")}>
					<Checkbox
						onChange={() => toggleSelectAll()}
						checked={wallets.length > 0 && selectedWallets.length === wallets.length}
					/>
				</Tippy>
			),
			className: "justify-center pr-3",
			id: "select",
		},
	];

	return (
		<Table columns={columns} data={wallets}>
			{(wallet: LedgerData) => (
				<TableRow>
					<TableCell isSelected={isSelected(wallet.index)} variant="start" innerClassName="space-x-3">
						<Avatar address={wallet.address} noShadow />
						<Address address={wallet.address} />
					</TableCell>
					<TableCell isSelected={isSelected(wallet.index)} innerClassName="font-semibold" className="w-64">
						<AmountWrapper isLoading={isLoading(wallet.index)} isFailed={isFailed(wallet.index)}>
							<Amount value={wallet.balance!} ticker={network.ticker()} />
						</AmountWrapper>
					</TableCell>
					<TableCell isSelected={isSelected(wallet.index)} innerClassName="justify-center">
						<Checkbox
							disabled={isLoading(wallet.index) || isFailed(wallet.index)}
							checked={isSelected(wallet.index)}
							onChange={() => toggleSelect(wallet.index)}
						/>
					</TableCell>
				</TableRow>
			)}
		</Table>
	);
};

export const LedgerScanStep = ({
	profile,
	setRetryFn,
}: {
	profile: Profile;
	setRetryFn: (fn?: () => void) => void;
}) => {
	const { t } = useTranslation();
	const { watch, register, setValue } = useFormContext();

	const { isBusy, isAwaitingConnection } = useLedgerContext();

	const [network] = useState<Network>(() => watch("network"));

	const ledgerScanner = useLedgerScanner(network.coin(), network.id(), profile);
	const { scanUntilNewOrFail, selectedWallets, scanRetry, canRetry } = ledgerScanner;

	useEffect(() => {
		if (canRetry) {
			setRetryFn(() => scanRetry());
		} else {
			setRetryFn(undefined);
		}
		return () => setRetryFn(undefined);
	}, [setRetryFn, scanRetry, canRetry]);

	useEffect(() => {
		scanUntilNewOrFail();
	}, [scanUntilNewOrFail]);

	useEffect(() => {
		register("wallets", { required: true, validate: (value) => Array.isArray(value) && value.length > 0 });
	}, [register]);

	useEffect(() => {
		setValue("wallets", selectedWallets, { shouldValidate: true, shouldDirty: true });
	}, [selectedWallets, setValue]);

	return (
		<section data-testid="LedgerScanStep" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.LEDGER_CONNECTION_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.LEDGER_CONNECTION_STEP.SUBTITLE")}
			/>

			<FormField name="network">
				<FormLabel label={t("COMMON.CRYPTOASSET")} />
				<SelectNetwork id="ImportWallet__network" networks={[]} selected={network} disabled />
			</FormField>

			<LedgerTable network={network} {...ledgerScanner} />

			{(isBusy || isAwaitingConnection) && (
				<div className="inline-flex items-center justify-center w-full mt-8 space-x-3">
					<Spinner color="primary" />
					<span className="text-theme-secondary-text animate-pulse">{t("COMMON.LOADING_LEDGER")}</span>
				</div>
			)}
		</section>
	);
};