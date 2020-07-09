import { Breadcrumbs } from "app/components/Breadcrumbs";
import { WalletListItemProps } from "app/components/WalletListItem";
import { Transaction, TransactionTable } from "domains/transaction/components/TransactionTable";
import { WalletBottomSheetMenu } from "domains/wallet/components/WalletBottomSheetMenu";
import { WalletHeader } from "domains/wallet/components/WalletHeader/WalletHeader";
import { WalletRegistrations } from "domains/wallet/components/WalletRegistrations";
import { WalletVote } from "domains/wallet/components/WalletVote";
import React from "react";

const Divider = () => <div className="h-4 bg-theme-neutral-100" />;

type Wallet = WalletListItemProps & {
	address: string;
	balance: string;
	publicKey?: string;
	hasStarred?: boolean;
	transactions?: Transaction[];
	pendingTransactions?: Transaction[];
	delegates: {
		username: string;
		address: string;
		rank: number;
		isActive?: boolean;
		explorerUrl?: string;
		msqUrl?: string;
	}[];
	business?: {
		name: string;
	};
};

type Props = {
	wallets?: Wallet[];
	wallet: Wallet;
};

export const WalletDetails = ({ wallet, wallets }: Props) => {
	const crumbs = [
		{
			route: "portfolio",
			label: "Go back to Portfolio",
		},
	];

	return (
		<div className="relative">
			<Breadcrumbs crumbs={crumbs} />
			<WalletHeader
				coin={wallet.coinIcon}
				address={wallet.address}
				publicKey={wallet.publicKey}
				balance={wallet.balance}
				currencyBalance={wallet.fiat}
				name={wallet.walletName}
				isLedger={wallet.walletTypeIcons?.includes("Ledger")}
				isMultisig={wallet.walletTypeIcons?.includes("Multisig")}
				hasStarred={wallet.hasStarred}
			/>
			<Divider />

			<WalletVote delegates={wallet.delegates} />
			<Divider />

			<WalletRegistrations
				address={wallet.address}
				delegate={wallet.delegates?.[0]}
				business={wallet.business}
				isMultisig={wallet.walletTypeIcons?.includes("Multisig")}
				hasBridgechains={wallet.walletTypeIcons?.includes("Bridgechain")}
				hasSecondSignature={wallet.walletTypeIcons?.includes("Key")}
				hasPlugins={wallet.walletTypeIcons?.includes("Plugins")}
			/>
			<Divider />

			<div className="px-12 py-8">
				<h2 className="font-bold">Pending Transactions</h2>
				<TransactionTable transactions={wallet.pendingTransactions!} showSignColumn />
			</div>
			<div className="px-12 pt-4 pb-20">
				<h2 className="font-bold">Transaction History</h2>
				<TransactionTable transactions={wallet.transactions!} currencyRate="2" />
			</div>

			<WalletBottomSheetMenu walletsData={wallets!} />
		</div>
	);
};

WalletDetails.defaultProps = {
	wallets: [],
};
