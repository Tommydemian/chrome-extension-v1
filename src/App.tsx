// import { useEffect, useState } from "react";
// import { MoonIcon, SunIcon } from "lucide-react";
// Components
import { Container } from "./components/Container";
import { Heading } from "./components/Heading";
import { Tabs } from "./components/Tabs";
import { CustomCheckbox } from "./components/CustomCheckbox";
import { Footer } from "./components/Footer";
// hooks
import { useDomainTimes } from "./hooks/useDomainTimes";
import { useActiveStatus } from "./hooks/useActiveStatus";
import { useLiveTime } from "./hooks/useLiveTime";
// import { useDarkMode } from "./hooks/useDarkMode";
// utils
import { formatTime } from "./utils/formatTime";
import { resetTime } from "./utils/resetTime";
import { cn } from "./utils/cn";
import "./App.css";
// Types

function App() {
	// const { darkMode, toggleDarkMode } = useDarkMode();
	const { billableTime, handleBillableToggle, totalTime, times } =
		useDomainTimes();

	const { status } = useActiveStatus();

	const { liveTime, sumTime } = useLiveTime({ status, totalTime });

	return (
		<>
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
			<Container className="pb-4">
				<div className="flex justify-between items-center py-2">
					<div className="flex flex-col items-start">
						<h4 className="text-d-secondary">Total Time</h4>
						<p className="text-d-body text-base font-bold">
							{formatTime(sumTime)}
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
							<span
								className={cn(
									"font-semibold transition-colors duration-300",
									val.billable ? "text-d-body" : "text-d-secondary",
								)}
							>
								{domain}{" "}
							</span>
							<span
								className={cn(
									"ml-auto transition-colors duration-300",
									val.billable ? "text-d-body" : "text-d-secondary",
								)}
							>
								{formatTime(val.time)}
							</span>
						</li>
					))}
				</ul>
				<button type="button" onClick={resetTime}>
					reset
				</button>
			</Container>

			<Footer>
				<div className="w-2 h-2 rounded-full bg-accent mr-1 animate-pulse" />
				<p>
					Tracking:{" "}
					{status === "idle"
						? "off"
						: `${formatTime(liveTime?.time)} on 
					${liveTime?.domain}`}
				</p>
			</Footer>
		</>
	);
}

export default App;
