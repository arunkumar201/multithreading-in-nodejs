import express from "express";
import { calculateCount } from "./calculateCount.js";
import { Worker } from "worker_threads";
const app = express();

const THREAD_COUNT = 4;

const createWorker = () => {
	return new Promise((resolve, reject) => {
		const worker = new Worker("./workers/counterWorker.js", {
			workerData: { thread_count: THREAD_COUNT },
		});
		worker.postMessage(10_000_000_000);

		worker.on("error", (error) => {
			reject(error);
		});

		worker.on("message", (data) => {
			resolve(data);
		});
	});
};

app.get("/api/hello", (req, res) => {
	res.json({ message: "Hello, World!" });
});

app.get("/api/non-blocking", (req, res) => {
	console.log("Non-blocking request processed");
	res.status(200).json({ message: "Non-blocking request processed" });
});

//blocking route
app.get("/api/blocking/worker", async (req, res) => {
	const workerPromise = [];

	for (let i = 0; i < THREAD_COUNT; i++) {
		workerPromise.push(createWorker());
	}
	try {
		const workers_result = await Promise.all(workerPromise);
		console.debug("🚀 ~ app.get ~ workers_result:", workers_result);

		let count = workers_result.reduce((a, b) => a + b, 0);

		res
			.status(200)
			.json({ message: "Blocking request processed", count: count });
	} catch (error) {
		console.error("Worker error:", error);
		res.status(500).json({
			error: "An error occurred while processing the request",
		});
		
	}
	console.log("Blocking request processed");
});

app.get("/api/blocking", async (req, res) => {
	const counter = await calculateCount(); // blocking operation
	res
		.status(200)
		.json({ message: "Blocking request processed", count: counter });
	console.log("Blocking request processed");
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
