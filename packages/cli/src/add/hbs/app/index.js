const upath = require('upath');
const chalk = require('chalk');
const { pathExistsSync, outputFileSync, readFileSync } = require('fs-extra');
const appHBS = require('./app.hbs');
const routeHBS = require('./route.hbs');
const appAppend = require('../../actions/app-append');
const routesAppend = require('../../actions/routes-append');

module.exports = (opts) => {
	const { dir, extra, path, title, pathArr, navLevel, components, isMobile, humpModuleName } = opts || {};
	const [moduleName, ...childPathArr] = pathArr || [];
	const pathName = `${pathArr.join('-')}`;
	const childName = childPathArr.join('-');
	const outputPath = upath.normalize(`${dir}modules/${moduleName}/index.js`);

	const isFileExist = pathExistsSync(outputPath);

	let appContent = isFileExist ? readFileSync(outputPath, 'utf8') : appHBS({ title, moduleName, humpModuleName });
	routeContent = routeHBS({ 
		path, 
		title,
		pathName,
		childName,
		components,
		navLevel,
		extra,
		isMobile
	});


	const content = appAppend(appContent, routeContent, { 
		navLevel,
		moduleName,
		humpModuleName,
		pathArr
	}).replace(/( {4})/g, '\t').replace(/\n{2}/g, '\n');

	console.log(chalk`{green app.js}: {rgb(255,131,0) ${isFileExist ? 'modified' : 'created'}}`);
	outputFileSync(outputPath, content);

	// routes content
	console.log(chalk`{green routes.js}: {rgb(255,131,0) modified}`);
	const outputRoutesPath = upath.normalize(`${dir}routers/routes.js`);
	let routesContent = readFileSync(outputRoutesPath, 'utf8');
	routesContent = routesAppend(routesContent, { moduleName, humpModuleName });
	outputFileSync(outputRoutesPath, routesContent);
};