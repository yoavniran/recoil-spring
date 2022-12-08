const getLocalStorageInitializer = ({
	                                    key,
	                                    customInitializer,
                                    }) => {
	return ({ set, spring }) => {
		let data;

		try {
			const dataStr = localStorage.getItem(key);

			if (dataStr) {
				data = JSON.parse(dataStr);
			}
		} catch (ex) {
			console.warn("recoil:spring - FAILED TO READ DATA FROM LS", ex);
		}

		if (data) {
			const { atoms, metadata } = spring.getAtomsData();

			Object.entries(data)
				.forEach(([key, value]) => {
					if (atoms[key]) {
						if (metadata[key].isFamily) {
							//set atom family members correctly
							Object.entries(value)
								.forEach(([param, member]) => {
									set(atoms[key](param), member);
								});
						} else {
							set(atoms[key], value);
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
