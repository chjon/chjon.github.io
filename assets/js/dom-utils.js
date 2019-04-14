export function addOptionsToSelect(selectId, optionNames) {
	const select = document.getElementById(selectId);
	optionNames.forEach((optionName) => {
		const option = document.createElement('option');
		option.text = optionName;
		select.add(option);
	});
}

export function tieButtonToHandler(buttonId, handler) {
	const button = document.getElementById(buttonId);
	button.onclick = () => {
		handler(button);
	}
}

export function setPropertiesById(inputId, properties = {}) {
	const obj = document.getElementById(inputId);
	Object.keys(properties)
	.forEach((key) => {
		obj[key] = properties[key];
	});
}

export function setPropertiesByClass(className, properties = {}) {
	const objs = Object.values(document.getElementsByClassName(className));
	objs.forEach((obj) => {
		Object.keys(properties)
		.forEach((key) => {
			obj[key] = properties[key];
		});
	});
}

export function decodeURI() {
  const safeURI = decodeURIComponent(window.location.href);
  const uriComponents = safeURI.split('?');
  const url = uriComponents[0] || '';
  const queryComponents = (uriComponents[1] || '').split('&');
  const query = queryComponents.reduce((query, queryParam) => {
    const [key, value] = queryParam.split('=');
    query[key] = value;
    return query;
  }, {});
  return { url, query };
}