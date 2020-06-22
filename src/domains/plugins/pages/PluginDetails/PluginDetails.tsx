import { PluginHeader } from "domains/plugins/components/PluginHeader";
import { PluginInfo } from "domains/plugins/components/PluginInfo";
import React from "react";

export const PluginDetails = () => (
	<section className="h-full bg-theme-neutral-100">
		<PluginHeader
			author="ARK Ecosystem"
			category="Utility"
			url="github.com"
			rating="4.6"
			version="1.3.8"
			size="4.2"
		/>
		<PluginInfo
			about="Use the ARK Explorer to get full visibility of critical data from the ARK network. Data such as the latest blocks, wallet addresses and transactions. Plus monitor delegate status, their position and more."
			permissions={["Embedded Webpages", "API Requests", "Access to Profiles"]}
			screenshots={[1, 2, 3]}
		/>
		<span>Reviews</span>
	</section>
);
