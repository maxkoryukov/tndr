"use strict";

//var express         = require('express');
//var router          = express.Router();

var _               = require('lodash');
var debug           = require('debug')('tndr:lib:mw:allow');

// TODO : fix relative paths (https://gist.github.com/branneman/8048520)
var errors   = require('../errors');


let isAccessibleMwGen = function(perm){
	return function(req, res, next){
		if (!req.current.user.allow(perm)){
			return next(new errors.Forbidden());
		} else {
			return next();
		}
	}
}

let hbsRegMw = function(req, res, next){

	_.set(res, ['helpers', 'if-allow'], function(perm, options){

		if (!_.isFunction(_.get(req, 'current.user.allow'))){
			debug('req.current.user.allow is not a function');

			return '';

			//throw new Error('low-level access-checking function is not configured!');
		}

		if (req.current.user.allow(perm)){
			return options.fn(this);
		}

		return options.inverse(this);
	});
	debug('HBS-helper added to res');

	next();
}


exports = module.exports = {
	check: isAccessibleMwGen,
	hbsHelperMiddleware : hbsRegMw
}
