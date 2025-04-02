chrome.runtime.onMessage.addListener((request) => {
	if (request.type === "FIND_WORD") {
		const word = request.payload;
		console.log("Received word:", word);
		highlightWord(word);
	}
});

function highlightWord(word: string) {
	if (!word) return;
	const bodyText = document.body.innerHTML;
	const highlighted = bodyText.replace(
		new RegExp(word, "gi"),
		(match) => `<mark>${match}</mark>`,
	);
	document.body.innerHTML = highlighted;
}
