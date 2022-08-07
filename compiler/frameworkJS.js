const txt = `function create(tagName) {
	return document.createElement(tagName);
}

function createText(text) {
	return document.createTextNode(text);
}

function mount(element, parent) {
	parent.appendChild(element);
}

function setProps(element, props) {
	for (const key in props) {
		element.setAttribute(key, props[key]);
	}
}

function update(element, newProps) {
	for (const key in newProps) {
		element.setAttribute(key, newProps[key]);
	}
}

function setEvents(element, events) {
	for (const key in events) {
		element[key] = events[key];
	}
}

function destroy(element) {
	element.remove();
}
`;

export default txt;
