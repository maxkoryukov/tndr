exports = module.exports = {

	"env": {
		"node": false,
		"es6" : false,
		"jquery": true,
		"browser" : true,
	},

	"globals": {
		"ko" : true,
		"Handlebars" : true,
		"_" : true,

		// TODO : remove this rules
		"MSG" : true,
		"mode_create" : true,
		"showMessage" : true,
	},

	"rules": {
		"no-console" : ["warn"],
		"strict": ["off"],
	},
}
