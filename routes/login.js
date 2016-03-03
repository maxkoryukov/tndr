"use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes.login');
var models   = require('../models');
var _        = require('lodash');

router.get('/login', function(req, res, next) {
	res.render('login', { r: req.query.r });
});

router.post('/login', function(req, res, next) {

	var un = req.body.username;
	var pw = req.body.password;

	var done = function(id){
		if (id && id > 0){
			req.session.userId = id;
			req.session.save();

			let r = req.body.r;
			let url = '/';
			if (r){
				let b = new Buffer(r, 'base64');
				url = b.toString();
				if (!url.startsWith('/'))
					url = '/';
			}
			res.redirect(url);
		} else {
			res.render('login', { error: { message: 'Unknown user' }, r: req.query.r });
		};
	};

	models.user.authenticate(un, pw, done);
});

router.post('/logout', function(req, res, next) {
	req.session.destroy();
	res.redirect('/');
});

/* REQUIRE AUTH for all other requests */
router.all('*', function (req, res, next){
	if (req.session && req.session.userId){

		models.user.findById(req.session.userId).then(function(user){
			user = _.omit(user.get({ plain : true}), ['password', 'hash']);
			res.locals.user = user;
			debug(res.locals.user);
			next();
		});
	} else {
		var b = new Buffer(req.originalUrl);
		var backurl64 = b.toString('base64');
		res.redirect(`/login?r=${backurl64}`);
	}
});

module.exports = router;
