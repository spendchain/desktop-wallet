import { PluginHeader } from "domains/plugins/components/PluginHeader";
import { PluginInfo } from "domains/plugins/components/PluginInfo";
import { ReviewBox } from "domains/plugins/components/ReviewBox";
import React from "react";

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
		<div className="mt-5 bg-theme-background">
			<div className="mx-10 py-24 grid grid-cols-2 grid-flow-col divide-x divide-theme-neutral-300">
				<span className="col-span-2">Reviews</span>
				<div className="pl-10">
					<ReviewBox averageScore="4.3" ratings={ratings} totalAvaliations={347} />
				</div>
			</div>
		</div>
	</section>
);
