"use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes.users');
var _        = require('lodash');

router.get('/users/me', function(req, res, next) {

	res.locals.messages = _.concat([], req.flash('message'));

	res.render('users/me');
});

/* GET users listing. */
router.get('/users/list', function(req, res, next) {
	req.app.models.user.findAll({
		attributes : ['user', 'username'],
		order: [['username', 'DESC']],
	}).then(function(users){

		users = _.forEach(users, x => x.is_root = x.username==='root');
		debug('users ', users);

		res.render('users/list', { users : users });

	});
});

router.post('/users/change_password', function(req, res, next) {
	var u = res.locals.user;
	var un = u.username;

	var pw = req.body.passwordold;
	var pwn1 = req.body.passwordnew1;
	var pwn2 = req.body.passwordnew2;

	if (pwn1 !== pwn2){
		req.flash('message', 'New passwords do not match!');
		res.redirect('back');
		return;
	}

	req.app.models.user.changePassword(un, pw, pwn1).then( (result) => {
		if (result){
			req.flash('message', 'Password changed!');
		} else {
			req.flash('message', 'Unknown user!');
		}
		res.redirect('/users/me');
	});
});

router.route('/users/create')

	.get(function(req, res, next) {
		res.locals.messages = _.concat([], req.flash('message'));
		res.render('users/create');
	})

	.post(function(req, res, next) {
		var u = res.locals.user;

		var un = req.body.username;
		var pw = req.body.password;
		var pw2 = req.body.password2;

		debug(un, pw, pw2);
		if (pw !== pw2){
			req.flash('message', 'Passwords do not match!');
			res.redirect('back');
			return;
		}

		req.app.models.user.create({
				username: un,
				password: pw,
			})
			.then(function(){
				req.flash('message', 'User created!');
				res.redirect('/users/list');
			})
			.catch(function(err){
				res.locals.error = err;
				res.render('users/create');
			});
	});

module.exports = router;
