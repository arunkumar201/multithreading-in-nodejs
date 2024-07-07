export const calculateCount = (x, thread_count = 1) => {

	console.debug("🚀 ~ calculateCount ~ thread_count:", thread_count);

	console.debug("🚀 ~ calculateCount ~ x:", x);
	return new Promise((resolve, reject) => {
		let counter = 0;
		for (let i = 0; i < x / thread_count; i++) {
			counter++;
		}
		resolve(counter);
	});
};
