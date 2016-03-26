"use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes.builder');
var _        = require('lodash');

var baseurl = '/builder';

router.get(`${baseurl}/me`, function(req, res, next) {

	res.locals.messages = _.concat([], req.flash('message'));

	res.render('person/me');
});

module.exports = router;
