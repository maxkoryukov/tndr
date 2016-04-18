/*
 * @module mods/other
 */

"use strict";

var hbs    = require('hbs');
var debug  = require('debug')('hbs-helpers:other');

/*
 * Put blocks of raw hbs ( '{{' will remain )
 */
hbs.registerHelper('raw-helper', function(options) {
	return options.fn();
});


/*
 * set 'selected' attribute for `<select>` tag;
 */
hbs.registerHelper('selected', function(option, value){

	debug(option, ' ?= ', value);

	if (option === value) {
		return ' selected';
	} else {
		return '';
	}
});

