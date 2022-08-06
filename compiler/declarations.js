import * as acorn from "acorn";
import * as acornWalk from "acorn-walk";

function findDec(code) {
	let declarations = [];

	let ast = acorn.parse(code, { ecmaVersion: 6 });

	acornWalk.simple(ast, {
		VariableDeclaration(node) {
			const name = node.declarations[0].id.name;
			if (name.startsWith("$")) {
				declarations.push(name);
			}
		},
	});

	return declarations;
}

function findUses(code) {
	let letUses = [];

	/**
	 * Find all Identifier nodes in the code
	 */
	let ast = acorn.parse(code, { ecmaVersion: 6 });

	acornWalk.simple(ast, {
		Identifier(node) {
			if (node.name.startsWith("$")) {
				letUses.push(node.name);
			}
		},
	});

	return letUses;
}

export { findDec, findUses };
