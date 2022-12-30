
const recast = require("recast");
const { namedTypes } = require('ast-types');
const { parserConfig } = require('./config');
const { createIdentifier, createImportDeclaration, getPropValue } = require('./utils');

/**
 * layout/nav-config.js 文件插入代码片段
 * @param {*} source 原文件内容
 */
module.exports = (source, opts) => {
	const { moduleName } = opts || {};
	const sourceAST = recast.parse(source, parserConfig);
	const regex = new RegExp(`${moduleName}/index$`);
	const navConfigName = `${moduleName}NavConfig`;
	let isImported = false;
	
	recast.visit(sourceAST, {
		visitImportDeclaration(path) {
			isImported = regex.test(path.value.source.value);
			if (isImported) return this.abort();
			
			this.traverse(path);
		},
		visitClassDeclaration(path) {
			if (!isImported) {
				const importDeclaration = createImportDeclaration({ 
					name: moduleName,
					isDefault: false,
					variableName: navConfigName,
					importPath: `@modules/${moduleName}/index`
				});
				path.insertBefore(importDeclaration);
				this.abort(); // 终止遍历
			} 
			this.traverse(path);
		}
	});
	recast.visit(sourceAST, {
		visitArrayExpression(path) {
			const node = path.node;
			const parentNode = path.parent.node;
			if (namedTypes.AssignmentExpression.check(parentNode) && parentNode.left.property.name === 'INITIAL_NAV_DATA') {
				const navArray = node.elements || [];
				const isExist = navArray.some((it) => it.name === navConfigName);
				if (!isExist) {
					const identifier = createIdentifier({ name: navConfigName });
					navArray.push(identifier);
				}
				return this.abort(); // 终止遍历
			}
			this.traverse(path);
		},
	});
	
	return recast.print(sourceAST).code;
};