/*
 * @module hbs-helpers
 */

 "use strict";

var debug  = require('debug')('hbs-helpers');
var _      = require('lodash');

debug('register');

let helpers = _({})
	.merge( require('./date') )
	.merge( require('./extend-parent') )
	.merge( require('./i18n') )
	.merge( require('./include') )
	.merge( require('./other') )
	.value();

exports = module.exports = helpers;