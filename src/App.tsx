import { useEffect, useMemo, useState } from "react";
import { Container } from "./components/Container";
import { formatTime } from "./utils/formatTime";
// import { MoonIcon, SunIcon } from "lucide-react";
import "./App.css";
// import { useDarkMode } from "./hooks/useDarkMode";
import { Heading } from "./components/Heading";
import { Tabs } from "./components/Tabs";
import type { DomainTime } from "./types";
import { resetTime } from "./utils/resetTime";

import { CustomCheckbox } from "./components/CustomCheckbox";

function App() {
	// const { darkMode, toggleDarkMode } = useDarkMode();

	const [times, setTimes] = useState<Record<string, DomainTime>>({});

	const totalTime = useMemo(() => {
		return Object.values(times)
			.map((el) => el.time)
			.reduce((acc, curr) => acc + curr, 0);
	}, [times]);

	const billableTime = useMemo(() => {
		return Object.values(times)
			.filter((el) => el.billable)
			.reduce((acc, curr) => acc + curr.time, 0);
	}, [times]);

	useEffect(() => {
		console.log(billableTime, "billable object");
	}, [billableTime]);

	const handleBillableToggle = (domain: string) => {
		const current = times[domain];
		const newValue = !current.billable;

		chrome.runtime.sendMessage(
			{ action: "UPDATE_BILLABLE", domain, newValue },
			(res) => {
				console.log(res);
			},
		);
	};

	useEffect(() => {
		const tick = () => {
			chrome.runtime.sendMessage({ action: "GET_ACTIVE_INFO" }, (res) => {
				if (res.status === "OK") {
					const { domainTimes, activeDomain, startTime } = res;

					// domainTimes is an object: { [domain]: { time: number, billable: boolean } }
					// Let's clone or spread it so we don't mutate the original
					const displayTimes: Record<string, DomainTime> =
						JSON.parse(JSON.stringify(domainTimes)) || {};

					// If there's an active domain, add the "current session" time
					if (activeDomain && startTime) {
						const msSoFar = Date.now() - startTime;

						// If for some reason the background hasn't created an entry yet:
						if (!displayTimes[activeDomain]) {
							displayTimes[activeDomain] = { time: msSoFar, billable: false };
						} else {
							// Add msSoFar to the existing time
							displayTimes[activeDomain].time += msSoFar;
						}
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

	return (
		<Container className="pb-4">
			<Heading
				headingTitle="Time Tracker"
				headingSubtitle="Tracking your valuable time"
			>
				{/* <button
					onClick={toggleDarkMode}
					type="button"
					className="relative flex gap-0.5 ml-auto bg-l-accent"
				>
					{darkMode ? (
						<SunIcon className="w-6 h-6" />
					) : (
						<MoonIcon className="w-6 h-6" />
					)}
				</button> */}
			</Heading>
			<Tabs />
			<div className="flex justify-between items-center py-2">
				<div className="flex flex-col items-start">
					<h4 className="text-d-secondary">Total Time</h4>
					<p className="text-d-body text-base font-bold">
						{formatTime(totalTime)}
					</p>
				</div>
				<div className="flex flex-col items-start">
					<h4 className="text-d-secondary">Billable</h4>
					<p className="text-accent text-base font-bold filter-shadow">
						{formatTime(billableTime)}
					</p>
				</div>
			</div>
			<ul className="list-none text-left space-y-2">
				{Object.entries(times).map(([domain, val]) => (
					<li
						className="flex items-center border border-[#ffffff0d] cursor-pointer rounded-md py-[0.25em] px-[0.5em]"
						key={domain}
					>
						<CustomCheckbox
							checked={val.billable}
							onChange={handleBillableToggle}
							domain={domain}
						/>
						{/* <input
							className="mr-2"
							type="checkbox"
							name="billable"
							id="billable"
							checked={val.billable}
							onChange={() => handleBillableToggle(domain)}
						/> */}
						<span className="font-semibold">{domain} </span>
						<span className="ml-auto">{formatTime(val.time)}</span>
					</li>
				))}
			</ul>
			<button type="button" onClick={resetTime}>
				reset
			</button>
		</Container>
	);
}

export default App;
