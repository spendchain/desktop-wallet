import { PluginHeader } from "domains/plugins/components/PluginHeader";
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
		<span>hello world</span>
	</section>
);
