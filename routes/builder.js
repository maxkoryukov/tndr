/*
 * @module tndr.routes.builder
 */

 "use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes.builder');
var _        = require('lodash');

var baseurl = '/builder';

router.route(`${baseurl}/`)

	.get(function(req, res, next) {

		res.render('builder/index');
	});

module.exports = router;
