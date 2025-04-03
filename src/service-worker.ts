let activeTabId: number | null | undefined = null;
let domainTimes: Record<string, number> = {};
let activeDomain: string | null | undefined = null;
let startTime: number | null = null;

/**
 * Safely extracts the domain (hostname) from a URL string.
 */
function getDomain(url: string | undefined | null) {
	if (!url) return;
	try {
		const { hostname } = new URL(url);
		return hostname;
	} catch (error) {
		console.error(error);
		return null;
	}
}

function updateTimes() {
	if (!activeDomain || !startTime) return;

	const currentTime = Date.now();
	const oldValue = domainTimes[activeDomain] ?? 0;
	const newValue = oldValue + (currentTime - startTime);

	domainTimes[activeDomain] = newValue;
	startTime = currentTime;

	chrome.storage.local.set({ domainTimes });
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
	chrome.tabs.get(tabId, (tab) => {
		updateTimes();
		activeTabId = tab.id;
		activeDomain = getDomain(tab?.url);
		startTime = Date.now();
	});
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete") {
		// change domain in the same TAB
		if (tabId === activeTabId) {
			updateTimes();
			activeDomain = getDomain(tab?.url);
			startTime = Date.now();
		}
	}
});
chrome.tabs.onRemoved.addListener((tabId) => {
	if (tabId === activeTabId) {
		updateTimes();
		activeTabId = null;
		activeDomain = null;
		startTime = null;
	}
});

/**
 * Resets domain tracking data in memory and in chrome.storage.
 * Also clears "firstSet" or any other relevant flags if you want.
 */
function resetDomainTimes() {
	domainTimes = {};
	activeTabId = null;
	activeDomain = null;
	startTime = null;

	chrome.storage.local.set({ domainTimes: {}, firstSet: false }, () => {
		console.log("Reset domainTimes and firstSet in storage.");
	});
}

/**
 * Message listener for popup or content scripts.
 * Example actions:
 *   - RESET_TIME_SPENT: calls resetDomainTimes()
 *   - GET_TIME_SPENT: retrieves domainTimes from storage
 */
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
	if (request.action === "RESET_TIME_SPENT") {
		resetDomainTimes();
		sendResponse({ status: "OK", message: "Domain times reset" });
		return;
	}

	if (request.action === "GET_TIME_SPENT") {
		chrome.storage.local.get(["domainTimes"], (result) => {
			sendResponse({
				status: "OK",
				data: result.domainTimes || {}, // Return an object of domain -> total ms
			});
		});
		// Must return true to indicate we are responding asynchronously
		return true;
	}
});

// background.js
chrome.runtime.onMessage.addListener((req, _, sendResponse) => {
	if (req.action === "GET_ACTIVE_INFO") {
		sendResponse({
			status: "OK",
			domainTimes, // the existing totals
			activeDomain, // current domain in memory
			startTime, // current domain’s start time
		});
		return true;
	}
});
