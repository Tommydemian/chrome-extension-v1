type TimeRecord = {
	timeStart: number;
	timeEnd: number;
	totalTime: string;
	id: number;
	url: string;
	active: boolean;
};

// utils
function formatTimeDiff(startMs: number, endMs: number) {
	const diffMs = endMs - startMs;
	const totalSeconds = Math.floor(diffMs / 1000);

	// Extract hours and minutes
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);

	return { hours, minutes };
}

const currentTab: TimeRecord = {
	active: false,
	id: 0,
	timeEnd: 0,
	timeStart: 0,
	totalTime: "",
	url: "",
};

let timeSpent: TimeRecord[] = [];

chrome.storage.local.get(["timeSpent"], (result) => {
	timeSpent = result.timeSpent || [];
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabsList) => {
	if (tabsList.length > 0) {
		const startingAt = Date.now();
		currentTab.timeStart = startingAt;
		// extract active tab
		const [tab] = tabsList;

		chrome.storage.local
			.get(["firstSet"])
			.then((res) => res.firstSet || false)
			.then((didRun) => {
				if (!didRun) {
					timeSpent.push({
						active: currentTab.active,
						id: tab.id ?? 0,
						timeStart: startingAt,
						timeEnd: 0,
						totalTime: "",
						url: tab.url ? new URL(tab.url).hostname : "",
					});
					// SET time spent
					chrome.storage.local.set({ timeSpent }, () => {
						console.log("Updated timeSpent in storage:", timeSpent);
					});
					// SET first set
					chrome.storage.local.set({ firstSet: true });
				}
			})
			.catch((e) => console.error(e));
	}
});

chrome.tabs.onActivated.addListener((activeInfo) => {
	const biTime = Date.now();
	currentTab.timeEnd = biTime;
	const { hours, minutes } = formatTimeDiff(currentTab.timeStart, biTime);
	currentTab.totalTime = `${hours} hours and ${minutes} minutes`;
	console.log(`Elapsed: ${hours} hours and ${minutes} minutes`);

	console.log(activeInfo.tabId, "firing");
	// every time a tab switches
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		console.log(tab);
		timeSpent.push({
			active: tab.active,
			id: tab.id ?? 0,
			timeStart: biTime,
			timeEnd: 0,
			totalTime: "",
			url: tab.url ? new URL(tab.url).hostname : "",
		});
		chrome.storage.local.set({ timeSpent }, () => {
			console.log("Updated timeSpent in storage:", timeSpent);
		});
	});
});
