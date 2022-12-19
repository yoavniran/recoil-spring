const invariant = (...args) => {
	const checks = args.slice(0, -1),
	msg = args.slice(-1)[0];

	if (!checks.every(Boolean)) {
		throw new Error(msg);
	}
};

export default invariant;
