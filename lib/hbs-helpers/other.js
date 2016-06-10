/*
 * @module mods/other
 */

"use strict";

var debug  = require('debug')('hbs-helpers:other');

exports = module.exports = {
	/*
	 * Put blocks of raw hbs ( '{{' will remain )
	 */
	'raw-helper': function(options) {
		return options.fn();
	},


	/*
	 * set 'selected' attribute for `<select>` tag;
	 */
	selected: function(option, value){

		debug(option, ' ?= ', value);

		if (option === value) {
			return ' selected';
		} else {
			return '';
		}
	},

	'if-allow': function(){
		debug('I am a stub');
	}
}

