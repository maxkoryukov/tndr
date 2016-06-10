"use strict";

var _               = require('lodash');
var debug           = require('debug')('tndr:lib:mw:hbs-per-request-helpers');

exports = module.exports = function(req, res, next){

	let oldrender = res.render;

	res.render = function render(){

		let newargs = Array.prototype.slice.call(arguments);
		let options = newargs[1];

		let helpers = res.helpers;
		debug('append local HBS helpers');
		if (options){
			if (_.isObject(options)){

				if (options.helpers){
					_.assing(options.helpers, helpers);
				} else {
					_.set(options, 'helpers', helpers);
				}
			} else {
				throw new Error('HBS-per-request-helper: can not override this res.render() call.');
			}
		} else {
			options = { helpers: helpers };
		}
		newargs[1] = options;

		debug('DONE');
		return oldrender.apply(this, newargs);
	}

	next();
}
