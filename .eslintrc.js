exports = module.exports = {
	"extends": [
		"eslint:recommended"
		//"./node_modules/coding-standard/eslintDefaults.js",
		// Override eslintDefaults.js
		//"./node_modules/coding-standard/.eslintrc-es6",
		// Override .eslintrc-es6
		//"./node_modules/coding-standard/.eslintrc-jsx",
	],

	"env": {
		"node": true,
		"es6": true,
	},

	"rules": {
		// Override any settings from the "parent" configuration
		"comma-dangle" : ["error", "only-multiline"],
		"no-unused-vars" : ["warn", { "argsIgnorePattern": "next" }],
		"curly" : ["error"],
		"eqeqeq": ["error"],
		"no-process-exit": ["error"],
		"no-path-concat": ["error"],
		"no-extra-parens": ["error", "all", { "nestedBinaryExpressions": false }],
		"no-cond-assign": ["error"],
	},

	"quiet": true,
}
