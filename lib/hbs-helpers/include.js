/*
 * @module hbs-helpers/include
 */

"use strict";

var fs     = require('fs');

/*
 *
 */
exports = module.exports = {
	'include-raw': function(path) {
		try {
			var content = fs.readFileSync(path, 'utf8');
			return content;
		} catch (exc) {
			throw exc;
		}
	}
}
