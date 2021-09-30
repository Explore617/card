const path = require('path');

module.exports = {
	entry: './src/main.js',
	target: 'web',
	output: {
		path: path.resolve(__dirname, 'cards'),
		filename: 'genshindb.js',

		library: 'GenshinDB',
		libraryTarget: 'umd',
		umdNamedDefine: true
	}
}