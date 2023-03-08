
const recast = require("recast");
const { namedTypes } = require('ast-types');
const { parserConfig } = require('./config');
const { createSpreadElement, createImportDeclaration } = require('./utils');

module.exports = (source, opts) => {
	const { moduleName, humpModuleName } = opts || {};
	const sourceAST = recast.parse(source, parserConfig);
	const regex = new RegExp(`../modules/${moduleName}$`);
	const configName = `${humpModuleName}Config`;
	let isImported = false;
	
	recast.visit(sourceAST, {
		visitImportDeclaration(path) {
			isImported = regex.test(path.value.source.value);
			if (isImported) return this.abort();

			const importDeclaration = createImportDeclaration({ 
				name: humpModuleName,
				isDefault: false,
				variableName: configName,
				importPath: `../modules/${moduleName}`
			});
			path.insertBefore(importDeclaration);
			this.abort(); // 终止遍历
		},
	});

	recast.visit(sourceAST, {
		visitArrayExpression(path) {
			const node = path.node;
			const parentNode = path.parent.node;
			if (parentNode.id.name === 'dynamicRoutes') {
				const navArray = node.elements || [];
				const isExist = navArray.some((it) => it.argument.name === configName);
				if (!isExist) {
					const spread = createSpreadElement({ name: configName });
					navArray.push(spread);
				}
				return this.abort(); // 终止遍历
			}
			this.traverse(path);
		},
	});
	
	return recast.print(sourceAST).code;
};