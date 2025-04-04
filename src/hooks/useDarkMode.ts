import { useState, useEffect, useCallback } from "react";

export const useDarkMode = () => {
	const [darkMode, setDarkMode] = useState(true);

	// INIT
	useEffect(() => {
		// On initial load, see if we have a saved theme
		chrome.storage.local.get(["isDarkModeActive"], (res) => {
			if (typeof res.isDarkModeActive === "boolean") {
				setDarkMode(res.isDarkModeActive);
			}
		});
	}, []);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		// Save user preference
		chrome.storage.local.set({ isDarkModeActive: darkMode });
	}, [darkMode]);

	const toggleDarkMode = useCallback(() => {
		setDarkMode((prev) => !prev);
	}, []);

	return {
		darkMode,
		toggleDarkMode,
	};
};
