const getInvariant = (method = "some") =>
	(...args) => {
		const checks = args.slice(0, -1),
			msg = args.slice(-1)[0];

		if (!checks[method](Boolean)) {
			throw new Error(msg);
		}
	};

const invariant = getInvariant();

const invariantAll = getInvariant("every");

export default invariant;

export {
	invariantAll,
};
