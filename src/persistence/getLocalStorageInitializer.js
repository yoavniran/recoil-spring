const getLocalStorageInitializer = ({
	                                    key,
	                                    customInitializer = null,
	                                    onErrorHandler = null,
                                    }) => {
	return ({ set, spring }) => {
		let data;

		try {
			const dataStr = localStorage.getItem(key);

			if (dataStr) {
				data = JSON.parse(dataStr);
			}
		} catch (ex) {
			data = onErrorHandler?.(ex);
		}

		if (data) {
			Object.entries(data)
				.forEach(([key, value]) => {
					const atom = spring.getAtom(key),
						metadata = spring.getMetadata(key);

					if (atom) {
						if (metadata.isFamily) {
							//set atom family members correctly
							Object.entries(value)
								.forEach(([param, member]) => {
									set(atom(param), member);
								});
						} else {
							set(atom, value);
						}
					}
				});
		}

		if (customInitializer) {
			customInitializer(data, set);
		}
	};
};

export default getLocalStorageInitializer;
