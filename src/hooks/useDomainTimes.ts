import { useEffect, useMemo, useState } from "react";
import type { DomainTime } from "../types";
import { fetchActiveData } from "../utils/fetchActiveData";
export const useDomainTimes = () => {
	const [times, setTimes] = useState<Record<string, DomainTime>>({});

	useEffect(() => {
		fetchActiveData()
			.then((data) => setTimes(data.domainTimes))
			.catch((err) => console.error(err));
	}, []);

	// derivates
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

	// update toggle
	const handleBillableToggle = (domain: string) => {
		const current = times[domain];
		const newValue = !current.billable;

		setTimes((prev) => {
			const newTimes = { ...prev };
			newTimes[domain] = {
				...newTimes[domain],
				billable: newValue,
			};
			return newTimes;
		});

		chrome.runtime.sendMessage(
			{ action: "UPDATE_BILLABLE", domain, newValue },
			(res) => {
				console.log(res);
			},
		);
	};

	return { billableTime, handleBillableToggle, totalTime, setTimes, times };
};
