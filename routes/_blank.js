/*
 * @module tndr.routes.blank
 */

 "use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:blank');

var baseurl = '/blank';

router.route(`${baseurl}/`)

	.get(function(req, res, next) {
		debug('requested');
		res.render('blank/index');
	});

module.exports = router;
