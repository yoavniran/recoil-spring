const warn = process.env.NODE_ENV !== "production" ?
	(args) => {
		// eslint-disable-next-line no-console
		console.warn(...args);
	} :
	function() {
	};

export default warn;
