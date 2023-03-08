const upath = require('upath');
const chalk = require('chalk');
const { pathExistsSync, outputFileSync, readFileSync } = require('fs-extra');
const apiHBS = require('./api.hbs');
const apiAppend = require('../../actions/api-append');


module.exports = (opts) => {
	const { dir, template, pagingFeature, pathArr, APIName } = opts || {};
	const [moduleName, ...childPathArr] = pathArr || [];
	const childName = childPathArr.join('-');
	const outputPath = upath.normalize(`${dir}modules/${moduleName}/${childName}/api.js`);
	
	const isFileExist = pathExistsSync(outputPath);
	let apiContent = isFileExist ? readFileSync(outputPath, 'utf8') : apiHBS();	
	const content = apiAppend(apiContent, { 
		template,
		pagingFeature,
		APIName
	});

	console.log(chalk`{green ${childName}/api.js}: {rgb(255,131,0) ${isFileExist ? 'modified' : 'created'}}`);
	outputFileSync(outputPath, content);
};