import { useCallback, useState, type FC } from "react";
import { Container } from "./Container";
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
		<div className="py-4 border-b border-border-200">
			<Container className="flex justify-between items-center">
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
			</Container>
		</div>
	);
};
