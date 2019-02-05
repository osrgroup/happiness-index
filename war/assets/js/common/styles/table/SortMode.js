const SortMode = {
	ASCENDING: 1,
	DESCENDING: 2
};

const sortByValue = (value1, value2, sortMode) => {
	if (sortMode == SortMode.ASCENDING) {
		if (value1 < value2) return -1;
		if (value1 > value2) return 1;
	} else if (sortMode == SortMode.DESCENDING) {
		if (value2 < value1) return -1;
		if (value2 > value1) return 1;
	} else {
		throw new Error('Case not implemented: ' + sortMode);
	}

	return 0;
};

export { SortMode, sortByValue };
