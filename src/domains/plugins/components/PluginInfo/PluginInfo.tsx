import { Alert } from "app/components/Alert";
import React from "react";

type Props = {
	about: string;
	permissions: any;
	screenshots: any;
};

export const PluginInfo = ({ about, permissions, screenshots }: Props) => (
	<div className="mt-5 p-10 bg-theme-background">
		<div>
			<p className="font-bold">About the plugin</p>
			<p className="mt-3 text-theme-neutral-600">{about}</p>
		</div>
		<div className="mt-10">
			<p className="font-bold">Permissions</p>
			<p className="mt-3 text-theme-neutral-600">{permissions.join(", ")}</p>
		</div>
		<div className="mt-10 relative">
			<p className="font-bold">Screenshots</p>
			<p className="absolute top-0 right-0">Pagination</p>
			<div className="mt-3 flex space-x-4 pb-10">
				{screenshots.map((screenshot, idx) => (
					<div key={idx} className="rounded-lg w-1/3 h-56 bg-theme-neutral-500" />
				))}
			</div>
			<div className="pb-10">
				<Alert variant="warning" title="Disclaimer">
					The availability of this plugin in the ARK Desktop Wallet does not mean that either ARK.io or ARK
					SCIC is directly involved in the development or affiliated with the developer providing this plugin.
					By installing it on your wallet, you assume every responsibility
				</Alert>
			</div>
		</div>
	</div>
);
