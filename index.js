import express from "express";
import { calculateCount } from "./calculateCount.js";
import { Worker } from "worker_threads";
const app = express();

app.get("/api/hello", (req, res) => {
	res.json({ message: "Hello, World!" });
});

app.get("/api/non-blocking", (req, res) => {
	console.log("Non-blocking request processed");
	res.status(200).json({ message: "Non-blocking request processed" });
});

//blocking route
app.get("/api/blocking/worker", async (req, res) => {
	// const counter = await calculateCount(10_000_000_000); // blocking operation
	//using worker threads for a non-blocking operation
	const worker = new Worker("./workers/counterWorker.js");
	worker.postMessage(10_000_000_000);

	worker.on("error", (error) => {
		console.error(`Worker error: ${error}`);
		res.status(500).json({
			error: "An error occurred while processing the request",
		});
	});

	worker.on("message", (data) => {
		res
			.status(200)
			.json({ message: "Blocking request processed", count: data });
	});
	console.log("Blocking request processed");
});

app.get("/api/blocking", async (req, res) => {
	const counter = await calculateCount(10_000_000_000); // blocking operation
	res
		.status(200)
		.json({ message: "Blocking request processed", count: counter });
	console.log("Blocking request processed");
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
