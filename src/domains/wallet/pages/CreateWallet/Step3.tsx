import { Divider } from "app/components/Divider";
import { Header } from "app/components/Header";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { MnemonicVerification } from "../../components/MnemonicVerification";

export const ThirdStep = () => {
	const { getValues, register, setValue } = useFormContext();
	const mnemonic = getValues("mnemonic");
	const isVerified: boolean = getValues("verification");

	const { t } = useTranslation();

	const handleComplete = () => {
		setValue("verification", true, true);
	};

	useEffect(() => {
		if (!isVerified) {
			register("verification", { required: true });
		}
	}, [isVerified, register]);

	return (
		<section data-testid="CreateWallet__third-step">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_CONFIRMATION_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_CREATE_WALLET.PASSPHRASE_CONFIRMATION_STEP.SUBTITLE")}
				/>
			</div>

			<MnemonicVerification
				mnemonic={mnemonic}
				optionsLimit={6}
				handleComplete={handleComplete}
				isCompleted={isVerified}
			/>

			<Divider dashed />
		</section>
	);
};