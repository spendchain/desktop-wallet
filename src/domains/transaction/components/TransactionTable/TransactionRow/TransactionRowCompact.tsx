import React from "react";

import { Transaction } from "../TransactionTable.models";
import { TransactionRowAmount } from "./TransactionRowAmount";
import { TransactionRowMode } from "./TransactionRowMode";
import { TransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";

type Props = {
	transaction: Transaction;
	walletName?: string;
};

export const TransactionRowCompact = ({ transaction, walletName }: Props) => {
	return (
		<tr data-testid="TransactionRowCompact" className="border-b border-dotted border-theme-neutral-300">
			<td className="w-32 py-3">
				<TransactionRowMode {...transaction} />
			</td>
			<td>
				<TransactionRowRecipientLabel {...transaction} walletName={walletName} />
			</td>
			<td className="text-right">
				<TransactionRowAmount {...transaction} />
			</td>
		</tr>
	);
};
