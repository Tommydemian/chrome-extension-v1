import type { DomainTime } from "./types";

let activeTabId: number | null | undefined = null;
let domainTimes: Record<string, DomainTime> = {};
let activeDomain: string | null | undefined = null;
let startTime: number | null = null;

chrome.storage.local.get(["domainTimes"], (res) => {
	if (res.domainTimes) {
		domainTimes = res.domainTimes;
		console.log("Reinitialized domainTimes from storage:", domainTimes);
	}
});

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
	const oldValue = domainTimes[activeDomain] ?? { time: 0, billable: false };
	const newValue = {
		time: oldValue.time + (currentTime - startTime),
		billable: oldValue.billable,
	};

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

	chrome.storage.local.set({ domainTimes: {} }, () => {
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

// IDLE
// 1) Set idle threshold to 1 minute
chrome.idle.setDetectionInterval(60);

// 2) Listen for idle changes
chrome.idle.onStateChanged.addListener((newState) => {
	if (newState === "idle" || newState === "locked") {
		console.log(`User is ${newState}, finalize current domain.`);
		updateTimes();
		activeDomain = null;
		startTime = null;
	} else if (newState === "active") {
		console.log("User is active again.");
		// Resume tracking for the active tab
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs.length > 0) {
				const [tab] = tabs;
				activeDomain = getDomain(tab?.url);
				startTime = Date.now();
			}
		});
	}
});

chrome.runtime.onMessage.addListener((req, _, sendResponse) => {
	if (req.action === "UPDATE_BILLABLE") {
		// For safety, check if domainTimes[req.domain] exists:
		if (!domainTimes[req.domain]) {
			domainTimes[req.domain] = { time: 0, billable: req.newValue };
		} else {
			domainTimes[req.domain].billable = req.newValue;
		}
		chrome.storage.local.set({ domainTimes });
		sendResponse({ status: "OK" });
		return true;
	}
});
