import fs from "fs";
import * as parse5 from "parse5";
import { config } from "../config.js";
import { format } from "prettier";
import { templateParser } from "./template.js";
import { findDec, findUses } from "./declarations.js";
import CleanCSS from "clean-css";

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

		function walk(astNode, node, options = {}) {
			if (node.nodeName === "#text") {
				const dependencies = node.value.match(/state\.([a-zA-Z0-9]+)/g);

				if (options.css) {
					node.value = new CleanCSS().minify(node.value).styles;
				}

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
					events: {},
					id: nanoID(),
				};

				node.attrs.forEach((attr) => {
					const { name, value } = attr;

					if (name.startsWith("on")) {
						ast.events[name] = value;
					} else {
						ast.props[name] = value;
					}
				});

				node.childNodes.forEach((child) => {
					walk(ast, child, {
						css: node.nodeName === "style",
					});
				});

				astNode.children.push(ast);
			}
		}

		node.childNodes.forEach(walk.bind(null, ast));

		return ast;
	}

	removeEmptyTextNodes(node);

	let ast = genAST(node);

	let _globals = [];
	const addGlobal = (name) => {
		if (_globals.find((g) => g === name)) return;
		_globals.push(name);
		return name;
	};

	let _uses = [];
	let _updateFns = [];

	function genCode(ast) {
		function generate(
			astNode,
			options = {
				isFor: false,
			}
		) {
			let children = [];
			let id = astNode.id || "root";

			let codes = {
				type: astNode.type,
				id,
				isFor: true,
				create: f`
                	${id} = create("${astNode.type}");
                `,
				mount: f`
                    mount(${id}, ${id === "root" ? "render" : "root"});
                    `,
				unmount: f`
                    destroy(${id});
                `,
			};

			addGlobal(id);

			if (!astNode.children) return;

			astNode.children.forEach((child) => {
				const type = child.type;

				if (type === "Text") {
					let textId = child.id;
					const text = templateParser(child.value);

					children.push({
						type: "Text",
						id: textId,
						isFor: true,
						value: child.value,
						create: f`
                        	${textId}_val = ()=>(${text});

							${textId} = createText(${textId}_val());

							${textId}_update = () => {
								${textId}.textContent = ${textId}_val();
							}
                        `,
						mount: f`
                            mount(${textId}, ${id});
                        `,
						unmount: f`
                            destroy(${textId});
                        `,
						update: f`
							${textId}_update();
						`,
					});

					const uses = findUses(text);

					uses.forEach((use) => {
						_updateFns.push({
							name: use,
							fn: textId + "_update",
						});
					});

					addGlobal(`${textId}_val`);
					addGlobal(`${textId}`);
					addGlobal(`${textId}_update`);
				} else {
					let children_ = generate(child, {
						isFor: true,
					}).children;

					let childId = child.id || "root";

					let props = {};

					let uses = [];

					Object.keys(child.props).map((key) => {
						const value = child.props[key];
						let parsedValue = templateParser(value);

						if (key === "for") {
							parsedValue = value;
						}

						props[key] = parsedValue;

						uses = [...uses, ...findUses(parsedValue)];
					});

					uses = [...new Set(uses.filter((u) => u.trim()))];

					if (props.for) {
						const for_ = props.for;
						const in_ = props.in;

						let block = {
							type,
							id: childId,
							children: children_,
							isFor: true,
							create: f`
								function block_${childId}_create(${for_}) {
									
								}


							`,
							mount: f`
								block_${childId}_create();
							`,
							unmount: f`
								
							`,
							update: f`
								`,
						};

						children.push(block);

						addGlobal(childId);
						addGlobal(`${childId}_props`);
						addGlobal(`${childId}_update_props`);

						uses.forEach((use) => {
							_updateFns.push({
								name: use,
								fn: childId + "_update_props",
							});
						});
						
						return;
					}

					children.push({
						type,
						id: childId,
						children: children_,
						isFor: true,
						create: f`
								${childId} = create("${type}");
	
								${childId}_props = () => {
									setProps(${childId},
										{ 
										${Object.keys(props).map((key) => {
											return `${key}: ${props[key]}`;
										})}
										});
									}
	
								${childId}_props();
	
								setEvents(
									${childId},
	
									{
										 ${Object.keys(child.events).map((key) => {
												const fn = child.events[key];
												const uses = findUses(fn);

												_uses.push(findUses(fn));

												return `${key}: ()=>{
										(${child.events[key]})();
	
										${uses.map((u) => `__${u}__();`).join("\n")}
							
									 }`;
											})}
								});
	
								${childId}_update_props = ${childId}_props;
							`,
						mount: f`
								mount(${childId}, ${id});
	
								${children_.map((child) => child.mount).join("\n")}
							`,
						unmount: f`
								destroy(${childId});
	
								${children_.map((child) => child.unmount).join("\n")}
							`,
						update: f`
								${children_.map((child) => child.update).join("\n")}
								`,
					});

					addGlobal(childId);
					addGlobal(`${childId}_props`);
					addGlobal(`${childId}_update_props`);

					uses.forEach((use) => {
						_updateFns.push({
							name: use,
							fn: childId + "_update_props",
						});
					});
				}
			});

			return {
				...codes,
				children,
				isFor: options.isFor,
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

		out += "let " + _globals.join(", ") + ";\n";

		function walk(node) {
			if (node.isFor) log(node.isFor);

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

		const newUpdateFns = [];

		_updateFns.forEach((fn) => {
			const { name, fn: fnName } = fn;

			const results = newUpdateFns.findIndex((f) => f.name === name);

			if (results === -1) {
				newUpdateFns.push({
					name,
					body: [fnName],
				});
			} else {
				newUpdateFns[results].body.push(fnName);
			}
		});

		out = f`
			${out}

			${newUpdateFns
				.map((fn) => {
					return f`
					function __${fn.name}__() {
						${fn.body.map((f) => `${f}();`).join("\n")}
					}
					`;
				})
				.join("\n")}
			
		`;

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
