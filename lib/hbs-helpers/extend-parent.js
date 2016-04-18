/*
 * @module hbs-helpers/extend-parent
 */

"use strict";

var hbs    = require('hbs');

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
