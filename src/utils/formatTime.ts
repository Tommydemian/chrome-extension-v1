export const formatTime = (ms: number) => {
	let seconds = Math.floor(ms / 1000);
	let minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	seconds = seconds % 60;
	minutes = minutes % 60;

	let formattedTime = `${seconds}s`;
	if (minutes > 0) {
		formattedTime = `${minutes}m ${formattedTime}`;
	}
	if (hours > 0) {
		formattedTime = `${hours}h ${formattedTime}`;
	}
	return formattedTime;
};
