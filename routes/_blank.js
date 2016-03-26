/*
 * @module tndr.routes.blank
 */

 "use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:blank');
var _        = require('lodash');

var baseurl = '/blank';

router.route(`${baseurl}/me`)

	.get(function(req, res, next) {

		res.render('blank/me');
	});

module.exports = router;
