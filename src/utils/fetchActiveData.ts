import type { GetActiveInfoRes } from "../types";

export const fetchActiveData = (): Promise<GetActiveInfoRes> => {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(
			{ action: "GET_ACTIVE_INFO" },
			(res: GetActiveInfoRes) => {
				if (!res) {
					return reject(new Error("No response from background"));
				}
				if (res.status === "OK") {
					resolve(res);
				} else {
					reject(new Error(`Failed with status: ${res.status}`));
				}
			},
		);
	});
};
