export const templateParser = (text) => {
	let out = "`";

	let i = 0;

	while (i < text.length) {
		const char = text[i];

		if (char === "{" && text[i + 1] === "{") {
			let inside = "";

			i += 2;

			while (i < text.length) {
				const char = text[i];

				if (char === "}" && text[i + 1] === "}") {
					i += 2;
					break;
				} else {
					inside += char;
					i++;
				}
			}

			out += "`+(" + inside + ")+`";
		} else {
			out += char;
			i++;
		}
	}

	return out + "`";
};
