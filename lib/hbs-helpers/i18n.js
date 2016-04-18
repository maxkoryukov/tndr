/*
 * @module hbs-helpers/i18n
 */

"use strict";

var hbs    = require('hbs');

/*
 * Register i18n stub
 */
hbs.registerHelper('__', function(s) {
	return s;
});
