/*
 * @module hbs-helpers
 */

 "use strict";

var debug  = require('debug')('hbs-helpers:other');

debug('hbs-helpers', 'register');

require('./date');
require('./extend-parent');
require('./i18n');
require('./other');

exports = module.exports = {};
