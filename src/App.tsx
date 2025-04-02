import { type ChangeEvent, type FormEvent, useState } from "react";
import { Container } from "./components/Container";
// import { handleCon } from "./contentScipt";
import "./App.css";

function App() {
	const [word, setWord] = useState<string>("");
	// const [time, setTimes] = useState<Record<string, number>>({});

	// useEffect(() => {
	// 	chrome.runtime.sendMessage({ type: "GET_TIME" }, (res) => {
	// 		console.log(res.timeSpent, "res");
	// 		setTimes(res);
	// 	});
	// }, []);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setWord(e.target.value);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// query the current active tab
		const [tab] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});

		if (tab.id) {
			// send message to the content script
			chrome.tabs.sendMessage(tab.id, {
				type: "FIND_WORD",
				payload: word,
			});
		}
	};

	return (
		<Container className="space-y-4">
			<p>Find word</p>
			<form onSubmit={handleSubmit}>
				<label htmlFor="word">
					<input
						type="text"
						id="word"
						name="word"
						value={word}
						onChange={handleChange}
						className="border border-gray-50 py-0.5 rounded-md"
					/>
				</label>
				<button className="mt-4" type="submit">
					Submit
				</button>
			</form>
			<button type="button">handleCon</button>
		</Container>
	);
}

export default App;
