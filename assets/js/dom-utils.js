export function addOptionsToSelect(selectId, optionNames) {
	const select = document.getElementById(selectId);
	optionNames.forEach((optionName) => {
		const option = document.createElement('option');
		option.text = optionName;
		select.add(option);
	});
}