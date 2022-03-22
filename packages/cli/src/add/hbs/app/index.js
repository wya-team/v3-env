const upath = require('upath');
const chalk = require('chalk');
const { pathExistsSync, outputFileSync, readFileSync } = require('fs-extra');
const appHBS = require('./app.hbs');
const routeHBS = require('./route.hbs');
const appAppend = require('../../actions/app-append');

module.exports = (opts) => {
	const { dir, extra, path, title, pathArr, navLevel, components } = opts || {};
	const [moduleName, ...childPathArr] = pathArr || [];
	const pathName = `${pathArr.join('-')}`;
	const childName = childPathArr.join('-');
	const outputPath = upath.normalize(`${dir}modules/${moduleName}/index.js`);
	
	const isFileExist = pathExistsSync(outputPath);

	let appContent = isFileExist ? readFileSync(outputPath, 'utf8') : appHBS({ title, moduleName });
	routeContent = routeHBS({ 
		path, 
		title,
		pathName,
		childName,
		components,
		navLevel,
		extra
	});

	const content = appAppend(appContent, routeContent, { 
		navLevel,
		moduleName,
		pathArr
	});

	console.log(chalk`{green app.js}: {rgb(255,131,0) ${isFileExist ? 'modified' : 'created'}}`);
	outputFileSync(outputPath, content);
};