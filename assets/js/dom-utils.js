export function addOptionsToSelect(selectId, optionNames) {
	const select = document.getElementById(selectId);
	optionNames.forEach((optionName) => {
		const option = document.createElement('option');
		option.text = optionName;
		select.add(option);
	});
}

export function tieButtonToHandler(buttonId, handler) {
	setProperties(buttonId, { onclick: handler });
}

export function setProperties(inputId, properties = {}) {
	const obj = document.getElementById(inputId);
	Object.keys(properties)
	.forEach((key) => {
		obj[key] = properties[key];
	});
}