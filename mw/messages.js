"use strict";

var express         = require('express');
var router          = express.Router();
var _               = require('lodash');
var debug           = require('debug')('tndr:mw.messages');

router.route('*')
	.get(function(req, res, next) {

		res.locals.messages = _.concat([], req.flash('message'));

		debug('MESSAGES:', res.locals.messages);

		next();
	});

module.exports = router;
