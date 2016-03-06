"use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes.login');
var _        = require('lodash');

router.get('/login', function(req, res) {
	res.render('login', { r: req.query.r });
});

router.post('/login', function(req, res) {

	var un = req.body.username;
	var pw = req.body.password;

	req.app.models.user.authenticate(un, pw)
		.then(function done_auth(id) {
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
				// TODO : learn, how to implement
				//next();
			} else {
				res.render('login', { error: { message: 'Unknown user' }, r: req.query.r });
				//next();
			}
		});
});

router.post('/logout', function(req, res) {
	req.session.destroy();
	res.redirect('/');

	// TODO : think about next()
});

/* REQUIRE AUTH for all other requests */
router.all('*', function (req, res, next){

	// PREAUTH !!
	req.session.userId = 1;

	if (req.session && req.session.userId){

		req.app.models.user.findById(req.session.userId).then(function(user){
			user = _.omit(user, ['password', 'hash']);
			res.locals.user = user;
			debug(res.locals.user);
			next();
		});
	} else {
		var b = new Buffer(req.originalUrl);
		var backurl64 = b.toString('base64');
		res.redirect(`/login?r=${backurl64}`);
		//res.redirect(`/login`);
	}
});

module.exports = router;
