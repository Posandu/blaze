import fs from "fs";
import * as parse5 from "parse5";
import { config } from "../config.js";
import { format } from "prettier";

/***/
const _code = fs.readFileSync(config.TEST_DIR + "/component.html", "utf8");
const f = (...args) => {
	const real = String.raw(...args);
	return format(real, { parser: "babel" }).trim();
};
const log = (...args) => console.dir(args, { depth: null });
let id = 0;
const nanoID = () => "_" + (++id).toString(36);
/** */

function transform(_code) {
	let out = "";
	let node = parse5.parseFragment(_code);

	function removeEmptyTextNodes(node) {
		if (!node.childNodes) return;

		for (let i = 0; i < node.childNodes.length; i++) {
			if (node.childNodes[i].nodeName === "#text") {
				if (node.childNodes[i].value.trim() === "") {
					node.childNodes.splice(i, 1);
					i--;
				} else {
					node.childNodes[i].value = node.childNodes[i].value.trim();
				}
			}
		}

		node.childNodes.forEach(removeEmptyTextNodes);
	}

	function genAST(node) {
		let ast = {
			type: "App",
			children: [],
			props: {},
		};

		function walk(astNode, node) {
			if (node.nodeName === "#text") {
				const dependencies = node.value.match(/state\.([a-zA-Z0-9]+)/g);

				astNode.children.push({
					type: "Text",
					value: node.value,
					id: nanoID(),
					dependencies,
				});
			} else {
				let ast = {
					type: node.nodeName,
					children: [],
					props: {},
					id: nanoID(),
				};

				node.attrs.forEach((attr) => {
					ast.props[attr.name] = attr.value;
				});

				node.childNodes.forEach((child) => {
					walk(ast, child);
				});

				astNode.children.push(ast);
			}
		}

		node.childNodes.forEach(walk.bind(null, ast));

		return ast;
	}

	removeEmptyTextNodes(node);

	let ast = genAST(node);

	function genCode(ast) {
		function generate(astNode) {
			let children = [];
			let id = astNode.id || "root";

			let codes = {
				type: astNode.type,
				id,
				create: f`
                    const ${id} = create("${astNode.type}");

                    setProps(${id}, ${JSON.stringify(astNode.props)});
                `,
				mount: f`
                    mount(${id}, ${id === "root" ? "render" : "root"});
                    `,
				unmount: f`
                    destroy(${id});
                `,
			};

			if (!astNode.children) return;

			astNode.children.forEach((child) => {
				const type = child.type;

				if (type === "Text") {
					let textId = child.id;

					children.push({
						type: "Text",
						id: textId,
						value: child.value,
						create: f`
                            const ${textId} = createText(${JSON.stringify(
							child.value
						)});

                        const ${textId}_dependencies = [${child.dependencies}]
                        `,
						mount: f`
                            mount(${textId}, ${id});
                        `,
						unmount: f`
                            destroy(${textId});
                        `,
					});
				} else {
					let children_ = generate(child).children;

					let childId = child.id || "root";

					children.push({
						type,
						id: childId,
						children: children_,
						create: f`
                            const ${childId} = create("${type}");
                        `,
						mount: f`
                            mount(${childId}, ${id});

                            ${children_.map((child) => child.mount).join("\n")}
                        `,
						unmount: f`
                            destroy(${childId});

                            ${children_
															.map((child) => child.unmount)
															.join("\n")}
                        `,
					});
				}
			});

			return {
				...codes,
				children,
			};
		}

		const generated = generate(ast);

		fs.writeFileSync(
			config.TEST_DIR + "/_component.json",
			JSON.stringify(generated, null, 2)
		);

		return generated;
	}

	let traversed = genCode(ast);

	function generateCode(traversed) {
		let out = "";

		function walk(node) {
			out += `
                ${node.create}
            `;

			if (!node.children) return;

			node.children.forEach((child) => {
				walk(child);
			});

			out += `
                ${node.mount}
            `;
		}

		walk(traversed);

		out = f`${out}`;

		fs.writeFileSync(config.TEST_DIR + "/_component.js", out);

		return out;
	}

	fs.writeFileSync(config.TEST_DIR + "/_component.js", generateCode(traversed));

	fs.writeFileSync(
		config.TEST_DIR + "/component.json",
		JSON.stringify(ast, null, 2)
	);
}

transform(_code);
