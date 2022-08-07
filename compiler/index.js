import fs from "fs";
import * as parse5 from "parse5";
import { config } from "../config.js";
import { format } from "prettier";
import { templateParser } from "./template.js";
import { findDec, findUses } from "./declarations.js";
import CleanCSS from "clean-css";
import frameworkJS from "./frameworkJS.js";

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
	let scripts = "";

	/**
	 * Remove Empty node
	 * @param {*} node
	 * @returns
	 */
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

	/**
	 * Remove Script nodes
	 * @param {*} node 
	 * @returns 
	 */
	function findScriptsAndRemove(node) {
		if (!node.childNodes) return;

		for (let i = 0; i < node.childNodes.length; i++) {
			if (node.childNodes[i].nodeName === "script") {
				scripts += node.childNodes[i].childNodes[0].value;
				node.childNodes.splice(i, 1);
				i--;
			} else {
				findScriptsAndRemove(node.childNodes[i]);
			}
		}
	}


	/**
	 * Generate AST for component
	 * @param {*} node
	 * @returns
	 */
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
	findScriptsAndRemove(node);

	let ast = genAST(node);

	let usesData = [];
	const addUses = (...args) =>
		(usesData = [...new Set([...usesData, ...args])]);

	function genCode(ast) {
		function generate(
			astNode,
		) {
			let children = [];
			let id = astNode.id || "root";

			let codes = {
				type: astNode.type,
				id,
				create: f`
                	const ${id} = create("${astNode.type}");
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
					const text = templateParser(child.value);

					const uses = findUses(text);

					addUses(...uses);

					children.push({
						type: "Text",
						id: textId,
						value: child.value,
						create: f`
                        	const ${textId}_val = ()=>(${text});

							let ${textId}_mounted = false;

							const ${textId} = createText(${textId}_val());

							const ${textId}_update = () => {
								if(${textId}_mounted) {
									${textId}.textContent = ${textId}_val();
								}
							}

							${uses
								.map(
									(u) => `
								__${u}__updates__.push(${textId}_update);
							`
								)
								.join("\n")}
                        `,
						mount: f`
                            mount(${textId}, ${id});
							${textId}_mounted = true;
                        `,
						unmount: f`
                            destroy(${textId});
							${textId}_mounted = false;
                        `,
						update: f`
						`,
					});
				} else {
					const children_ = generate(child).children;

					let childId = child.id || "root";

					let props = {};

					let uses = [];

					Object.keys(child.props).map((key) => {
						const value = child.props[key];
						let parsedValue = templateParser(value);

						if (key === "for" || key === "in") {
							parsedValue = value;
						}

						props[key] = parsedValue;

						uses = [...uses, ...findUses(parsedValue)];
					});

					uses = [...new Set(uses.filter((u) => u.trim()))];

					addUses(...uses);

					/**
					 *
					 * For
					 *
					 */
					if (props.for) {
						const for_ = props.for;
						const in_ = props.in;

						function getCreateCode(node) {
							let out = "";

							out += node.create;

							if (node.children) {
								node.children.forEach((child) => {
									out += getCreateCode(child);
								});
							}

							return out;
						}

						function getMountCode(node) {
							let out = "";

							out += node.mount;

							if (node.children) {
								node.children.forEach((child) => {
									out += getMountCode(child);
								});
							}

							return out;
						}

						function getUnmountCode(node) {
							let out = "";

							out += node.unmount;

							if (node.children) {
								node.children.forEach((child) => {
									out += getUnmountCode(child);
								});
							}

							return out;
						}

						function getUpdateCode(node) {
							let out = "";

							out += node.update;

							if (node.children) {
								node.children.forEach((child) => {
									out += getUpdateCode(child);
								});
							}

							return out;
						}

						let block = {
							type,
							id: childId,
							children: [],
							create: f`
								const ${childId} = create("${type}");

								function block_${childId}_create(${for_}) {
									/** Create Children */
									${children_.map((child) => getCreateCode(child)).join("\n")}

									const mount_${childId} = () => {
										${children_.map((child) => child.mount).join("\n")}
									}
									
									const unmount_${childId} = () => {
										${children_.map((child) => child.unmount).join("\n")}
									}

									const update_${childId} = () => {
										${children_.map((child) => child.update).join("\n")}
									}

									return {
										mount: mount_${childId},
										unmount: unmount_${childId},
										update: update_${childId},
										key: ${for_},
									}
								}
							`,
							mount: f`
								mount(${childId}, ${id});

								const ${childId}_items = (${in_});
								const ${childId}_items_added = [];
								let ${childId}_item_index = 0;

								const ${childId}_items_update = () => {
									
								${childId}_items.forEach((item) => {
									const created = block_${childId}_create(item);
									const key = created.key;
								
									if (!${childId}_items_added.find((added) => added.key === key)) {
											${childId}_items_added.push({
												key,
												created,
											});
											created.mount();
									}
								});
								
								${childId}_items_added.forEach((added) => {
										if (!${childId}_items.find((item) => item === added.key)) {
											added.created.unmount();
											${childId}_items_added.splice(${childId}_items_added.indexOf(added), 1);
										}
								});

							   }

							   	${childId}_items_update();

								   ${uses.map((u) => `__${u}__updates__.push(${childId}_items_update);`).join("\n")}


							`,
							unmount: f`
								unmount(${childId});
							`,
							update: f`
								
							`,
						};

						children.push(block);

						return block;
					}

					/**
					 *
					 * Normal
					 *
					 */
					children.push({
						type,
						id: childId,
						children: children_,
						isFor: true,
						create: f`
								const ${childId} = create("${type}");
	
								let ${childId}_mounted = false;

								const ${childId}_props = () => {
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

												addUses(...uses);

												return `${key}: ()=>{
										(${child.events[key]})();
	
										${uses.map((u) => `__${u}__updates__.emit();`).join("\n")}
							
									 }`;
											})}
								});
	
								const ${childId}_update_props = ${childId}_props;

								${uses.map((u) => `__${u}__updates__.push(${childId}_update_props);`).join("\n")}
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
				}
			});

			return {
				...codes,
				children
			};
		}

		const generated = generate(ast);

		fs.writeFileSync(
			config.TEST_DIR + "/component.json",
			JSON.stringify(generated, null, 2)
		);

		return generated;
	}

	let traversed = genCode(ast);

	function generateCode(traversed) {
		let out = `
			"use strict";

			${scripts}

			${frameworkJS}
		`

		usesData.map((u) => {
			out += `
			const __${u}__updates__ = ({
				items: [],
				push: (item) => {
					__${u}__updates__.items.push(item);
				},
				emit: () => {
					__${u}__updates__.items.forEach((item) => {
						item();
					});
				},
			})`
		});

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

		out = f`
			${out}
		`;

		return out;
	}

	fs.writeFileSync(config.TEST_DIR + "/_component.js", generateCode(traversed));
}

transform(_code);
