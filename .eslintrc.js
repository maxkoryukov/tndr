const path = require('path');

exports = module.exports = {
	"extends": [
		path.join(__dirname, 'node_modules', 'eslint-config-volebonet', 'index.js')
	],

	"env": {
		"node": true,
		"es6": true,
	},
	"quiet": true,
}
