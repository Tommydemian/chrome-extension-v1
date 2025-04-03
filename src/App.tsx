import { useEffect, useState } from "react";
import { Container } from "./components/Container";
import { formatTime } from "./utils/formatTime";
import "./App.css";

function App() {
	const [times, setTimes] = useState<Record<string, number>>({});

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
		console.log(times);
	}, [times]);

	const handleResetTime = () => {
		chrome.runtime.sendMessage({ action: "RESET_TIME_SPENT" }, (res) => {
			console.log(`state reset: ${res}`);
		});
	};

	return (
		<Container className="space-y-4">
			<h1 className="text-lg">Time tracker</h1>
			<button onClick={handleResetTime} type="button">
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
