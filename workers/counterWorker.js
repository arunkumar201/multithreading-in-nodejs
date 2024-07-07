import { parentPort, workerData } from "worker_threads";
import { calculateCount } from "../calculateCount.js";

parentPort.on("message", async (message) => {
	const count = await calculateCount(message, workerData?.thread_count ?? 1);

	parentPort.postMessage(count);
});
