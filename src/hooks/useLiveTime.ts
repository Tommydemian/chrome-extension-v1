import { useState, useEffect } from "react";
import type { DisplayDomainTime } from "../types";
import { fetchActiveData } from "../utils/fetchActiveData";

type LiveTimeConfig = {
	status: "idle" | "active";
	totalTime: number;
};

export const useLiveTime = ({ status, totalTime }: LiveTimeConfig) => {
	const [liveTime, setLiveTime] = useState<DisplayDomainTime | undefined>(
		undefined,
	);
	const [sumTime, setSumTime] = useState<number>(0);

	useEffect(() => {
		setSumTime(totalTime);
	}, [totalTime]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchActiveData().then((data) => {
			const { activeDomain } = data;
			if (activeDomain) {
				const entry = data.domainTimes[activeDomain] ?? {
					time: 0,
					billable: false,
				};

				setLiveTime({
					domain: activeDomain,
					time: entry.time,
					billable: entry.billable,
					pullTimestamp: Date.now(),
				});
			} else {
				// If there's no active domain, maybe reset or do something else
				setLiveTime({
					domain: "",
					time: 0,
					billable: false,
					pullTimestamp: Date.now(),
				});
			}
		});
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const intervalId = setInterval(() => {
			setLiveTime((prev) => {
				if (!prev || status === "idle") return;
				if (prev.time !== undefined && typeof prev.domain === "string") {
					setSumTime((prevSum) => prevSum + (Date.now() - prev.pullTimestamp));
					return {
						...prev,
						time: prev?.time + (Date.now() - prev.pullTimestamp),
						pullTimestamp: Date.now(),
					};
				}
			});
		}, 1000);
		return () => clearInterval(intervalId);
	}, [status]);

	return { liveTime, sumTime };
};
