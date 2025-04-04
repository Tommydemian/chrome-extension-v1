import { useCallback, useState, type FC } from "react";
import { cn } from "../utils/cn";

type Tabs = "today" | "weekly" | "invoice";
type TabsObj = {
	tabLabel: Tabs;
	id: number;
};

export const Tabs: FC = () => {
	const [activeTabId, setActiveTabId] = useState<number>(1);

	const tabs: TabsObj[] = [
		{ tabLabel: "today", id: 1 },
		{ tabLabel: "weekly", id: 2 },
		{ tabLabel: "invoice", id: 3 },
	];

	const handleActiveState = useCallback((id: number) => {
		setActiveTabId(id);
	}, []);

	return (
		<div className="flex py-4 justify-between items-center border-b border-[#ffffff0d]">
			{tabs.map((tab) => (
				<button
					onClick={() => handleActiveState(tab.id)}
					type="button"
					key={tab.id}
					className={cn(
						"capitalize font-semibold text-base transition-all duration-200",
						tab.id === activeTabId
							? "text-d-body bg-anchor-glass-bg"
							: "text-d-secondary",
					)}
				>
					{tab.tabLabel}
				</button>
			))}
		</div>
	);
};
