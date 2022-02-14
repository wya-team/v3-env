const upath = require('upath');
const chalk = require('chalk');
const fs = require('fs-extra');
const contentHBS = require('./index.hbs');

module.exports = (opts) => {
	const { dir, project, title, pathArr, vcPrefix } = opts || {};
	const [moduleName, ...childPathArr] = pathArr || [];
	const pathName = `${pathArr.join('-')}`;
	const childName = childPathArr.join('-');
	const outputContentPath = upath.normalize(`${dir}modules/${moduleName}/${childName}/index.vue`);

	console.log(chalk`{green form index}: {rgb(255,131,0) created}`);
	fs.outputFileSync(
		outputContentPath,
		contentHBS({
			project,
			title,
			moduleName,
			childName,
			vcPrefix,
			className: `v-${pathName}-form`,
			componentName: `${project}-${pathName}`,
		})
	);
};