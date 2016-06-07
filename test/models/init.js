"use strict";

var path   = require('path');

var models_path = path.join(process.cwd(), 'models');
var config = require(path.join(process.cwd(), 'config'));

var models = require(models_path)(config.models);

exports = module.exports = models;
