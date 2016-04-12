/*
 * @module tndr.routes.tender
 */

 "use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:tender');
var _        = require('lodash');

var baseurl = '/tender';

router.route(`${baseurl}/`)

	.get(function(req, res, next) {
		throw new Error('not implemented');
		//res.render('tender/me');
	})

router.route(`${baseurl}/wizard`)
	.get(function(req, res, next){
		let db = req.app.models;

		return res.render('tender/wizard');
	})

exports = module.exports = router;
