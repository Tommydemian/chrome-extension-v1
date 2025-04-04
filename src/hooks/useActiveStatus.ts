import { useEffect, useState } from "react";

export const useActiveStatus = () => {
	const [status, setStatus] = useState<"idle" | "active">("active");

	useEffect(() => {
		const handleIdleMessage = (msg: { type: string; newState: string }) => {
			console.log(msg, "msg");
			if (msg.type === "IDLE_STATE_CHANGED") {
				setStatus(() => (msg.newState === "idle" ? "idle" : "active"));
			}
		};
		chrome.runtime.onMessage.addListener(handleIdleMessage);
		return () => chrome.runtime.onMessage.removeListener(handleIdleMessage);
	}, []);

	return { status, setStatus };
};
