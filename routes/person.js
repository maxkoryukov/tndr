"use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes.person');
var _        = require('lodash');

router.get('/person/me', function(req, res, next) {

	res.locals.messages = _.concat([], req.flash('message'));

	res.render('person/me');
});

module.exports = router;
