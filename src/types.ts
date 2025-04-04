export type DomainTime = {
	time: number; // Total time in milliseconds
	billable: boolean; // Whether the time is billable
};

export type DisplayDomainTime = {
	domain: string;
	time: number;
	billable: boolean;
	pullTimestamp: number;
} | null;

export type GetActiveInfoRes = {
	status: "OK";
	domainTimes: Record<string, DomainTime>;
	activeDomain: string | null | undefined;
	startTime: number | null;
};
