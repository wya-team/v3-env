const babelParser = require('recast/parsers/babel');

const parserConfig = { 
	parser: {
		parse(source) {
			return babelParser.parse(source, {});
		}
	},
}; // recast内置Esprima，不支持import语法

module.exports = {
	parserConfig
};