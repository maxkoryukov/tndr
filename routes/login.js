"use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:login');
var _        = require('lodash');

var baseurl = '';

router.route(`${baseurl}/login`)

	.get(function(req, res) {
		res.render('login', { backurl: req.query.backurl });
	})

	.post(function(req, res) {

		let un = req.body.username;
		let pw = req.body.password;
		let backurl = req.body.backurl;

		req.app.models.user.authenticate(un, pw)
			.then(function auth_done(id) {
				if (_.isInteger(id) && id > 0){
					req.session.userId = id;
					req.session.save();

					let url = '/';
					if (backurl){
						let b = new Buffer(backurl, 'base64');
						url = b.toString();
						if (!url.startsWith('/')){
							url = '/';
						}
					}
					res.redirect(url);
				} else {
					req.addMessage('warn', 'Unknown user!');
					res.render('login', { backurl: backurl });
				}
			})
			.catch(function auth_fail(){
				req.addMessage('warn', 'Unknown user!');
				res.render('login', { backurl: backurl });
			});
	});

router.route(`${baseurl}/logout`)

	.post(function(req, res) {
		req.session.destroy();
		res.redirect('/');
	});

/* REQUIRE AUTH for all other requests */
router.route('*')

	.all(function (req, res, next){
		let db = req.app.models;

		if (req.app.config.security.autologin){
			req.session.userId = req.app.config.security.autologin;
		}

		if (req.session && req.session.userId){

			db.user.findById(req.session.userId).then(function(user){
				user = _.omit(user, ['password', 'hash']);
				req.current.user = user;
				debug('CURRENT USER:', req.current.user);
				next();
			});
		} else {
			var b = new Buffer(req.originalUrl);
			var backurl64 = b.toString('base64');
			res.redirect(`/login?backurl=${backurl64}`);
		}
	});

module.exports = router;
