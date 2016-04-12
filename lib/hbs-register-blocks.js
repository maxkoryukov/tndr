/*
 * @module mods/hbs-register-blocks
 */

"use strict";

var hbs   = require('hbs');
var debug = require('debug')('tndr:mods:hbs-register-blocks');

/*
 * Register i18n stub
 */
hbs.registerHelper('__', function(s) {
	return s;
});


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


/*
 * trick for registering layout-level blocks, defined in the partials
 * https://github.com/donpark/hbs/blob/master/examples/extend/
 */

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});


module.exports = {};
