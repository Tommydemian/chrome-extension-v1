import { useCallback, useEffect, useState } from "react";
import { Container } from "./components/Container";
import { formatTime } from "./utils/formatTime";
import { MoonIcon, SunIcon } from "lucide-react";
import "./App.css";

function App() {
	const [darkMode, setDarkMode] = useState(true);
	const [times, setTimes] = useState<Record<string, number>>({});
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

	useEffect(() => {
		const tick = () => {
			chrome.runtime.sendMessage({ action: "GET_ACTIVE_INFO" }, (res) => {
				if (res.status === "OK") {
					const { domainTimes, activeDomain, startTime } = res;
					const displayTimes = { ...domainTimes };

					// If there's an active domain, add the "current session" time
					if (activeDomain && startTime) {
						const msSoFar = Date.now() - startTime;
						displayTimes[activeDomain] =
							(displayTimes[activeDomain] ?? 0) + msSoFar;
					}

					setTimes(displayTimes);
				}
			});
		};

		// Call it once immediately
		tick();

		// Then every second while the popup is open
		const intervalId = setInterval(tick, 1000);
		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		chrome.storage.local.set({ isDarkModeActive: darkMode }, () => {
			console.log(`theme is: ${darkMode}`);
		});
	}, [darkMode]);

	const handleResetTime = () => {
		chrome.runtime.sendMessage({ action: "RESET_TIME_SPENT" }, (res) => {
			console.log(`state reset: ${res}`);
		});
	};

	return (
		<Container className="space-y-4 py-4">
			<div className="grid grid-cols-[1fr_auto_1fr] items-center">
				<div />
				<h1 className="text-xl">Time tracker</h1>
				<button
					onClick={toggleDarkMode}
					type="button"
					className="relative flex gap-0.5 ml-auto bg-l-accent"
				>
					{darkMode ? (
						<SunIcon className="w-6 h-6" />
					) : (
						<MoonIcon className="w-6 h-6" />
					)}
				</button>
			</div>
			<button className="bg-l-accent " onClick={handleResetTime} type="button">
				Reset Time
			</button>
			<ul className="list-none text-left space-y-1">
				{Object.entries(times).map(([domain, time]) => (
					<li className="flex" key={domain}>
						<span className="font-semibold">{domain}: </span>
						<span className="ml-auto">{formatTime(time)}</span>
					</li>
				))}
			</ul>
		</Container>
	);
}

export default App;
