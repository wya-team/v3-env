const upath = require('upath');
const chalk = require('chalk');
const fs = require('fs-extra');
const Handlebars = require('handlebars');
const listHBS = require('./list.hbs');
const tabsHBS = require('./tabs.hbs');

module.exports = (opts) => {
	const { dir, project, title, route, pathArr, pagingType, pagingMode, pagingFeature, APIName, humpModuleName } = opts || {};
	const [moduleName, ...childPathArr] = pathArr || [];
	const pathName = `${pathArr.join('-')}`;
	const childName = childPathArr.join('-');

	const isBasic = pagingType === 'basic';

	const isTableMode = pagingMode === 'table';
	const isPieceMode = pagingMode === 'piece';
	const isNativeMode = pagingMode === 'native';

	const isMultiple = pagingFeature.includes('multiple');
	const isExpand = pagingFeature.includes('expand');

	const outputListPath = upath.normalize(`${dir}modules/${moduleName}/${childName}/index.vue`);
	
	const extra = childPathArr.map(item => `${item[0].toUpperCase()}${item.slice(1)}`).join('');
	const stateName = `${moduleName}${extra}`;

	const options = {
		project,
		title,
		route,
		moduleName,
		childName,
		componentName: `${project}-${pathName}-table`,
		APIName,
		stateName,
		className: `v-${pathName}-list`,
		pagingMode,
		isBasic,
		isTableMode,
		isPieceMode,
		isNativeMode,
		isMultiple,
		isExpand
	};
	if (isBasic) {
		console.log(chalk`{green paging list}: {rgb(255,131,0) created}`);
		fs.outputFileSync(
			outputListPath,
			listHBS(options)
		);
	} else {
		console.log(chalk`{green paging tabs}: {rgb(255,131,0) created}`);
		fs.outputFileSync(
			outputListPath,
			tabsHBS(options)
		);
	}
	
};