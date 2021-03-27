/**
 * 强化项目的读写能力
 */
const { resolve } = require('path');
const { prompt, Separator } = require('inquirer');
const { exec } = require('shelljs');
const fs = require('fs-extra');

const question = [
	{
		type: 'confirm',
		name: 'install',
		message: 'npm install?',
		default: false
	},
	{
		type: 'input',
		name: '__INPUT__',
		message: '请输入:',
		default: '默认值',
		choices(answers) {
			if (answers.install) {
				let done = this.async();
				exec('npm install', { silent: true }, (code, stdout, stderr) => {
					console.log('Exit code:', code);
					console.log('Program output:', stdout);
					console.log('Program stderr:', stderr);

					if (code === 0) {
						done(null, true);
					}

				});
			}
		}
	}
];
(async () => {
	let result = await prompt(question);
	console.log(result);
})();