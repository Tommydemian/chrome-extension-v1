export const resetTime = () => {
	chrome.runtime.sendMessage({ action: "RESET_TIME_SPENT" }, (res) => {
		console.log(`state reset: ${res}`);
	});
};
