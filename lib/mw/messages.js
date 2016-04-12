"use strict";

var express         = require('express');
var router          = express.Router();
var _               = require('lodash');
var debug           = require('debug')('tndr:mw:messages');

router.use(function(req, res, next){
	req.addMessage = function message(level, msg){
		req.flash('messages', {
			level : level,
			body: msg
		});
	};
	next();
});

router.route('*')

	.get(function mw_message_route_get(req, res, next) {

		res.locals.messages = _.concat([], req.flash('messages'));

		debug('MESSAGES:', res.locals.messages);

		next();
	});

module.exports = router;
