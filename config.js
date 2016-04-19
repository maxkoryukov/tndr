/*
 * @module config
 */

"use strict";

var debug           = require('debug')('tndr:config');
var _               = require('lodash');
var path            = require('path');

var envname         = process.env.NODE_ENV || 'production';
var config_path     = path.join(__dirname, 'config', 'app.json');
var config          = require(config_path)[envname];

// ALWAYS: print config, when it is read from ENV:
debug(`ENV: ${envname}`);

if (!config.security) { config.security = {}; }

let alid = config.security.autologin;
config.security.autologin = null;
if (_.isInteger(alid)){
	config.security.autologin = alid;
}

let stpath = _.get(config, 'models.storage.path');
if (stpath){
	config.models.storage.path = _.spread(path.join)( stpath.split(path.sep) );
}

exports = module.exports = config;
