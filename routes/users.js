"use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes.users');
var models   = require('../models');
var _        = require('lodash');

router.get('/me', function(req, res, next) {

	res.locals.messages = _.concat([], req.flash('message'));

	res.render('users/me');
});

/* GET users listing. */
router.get('/list', function(req, res, next) {
	models.user.findAll({
		attributes : ['user', 'username'],
		order: [['username', 'DESC']],
	}).then(function(users){

		debug('users ', users);
		res.render('users/list', { users : users });

	});
});

router.post('/change_password', function(req, res, next) {
	var u = res.locals.user;
	var un = u.username;

	var pw = req.body.passwordold;
	var pwn1 = req.body.passwordnew1;
	var pwn2 = req.body.passwordnew2;

	if (pwn1 !== pwn2){
		req.flash('message', 'New passwords do not match!')
		res.redirect('back');
		return;
	}

	models.user.changePassword(un, pw, pwn1).then( (result) => {
		if (result){
			req.flash('message', 'Password changed!');
		} else {
			req.flash('message', 'Unknown user!');
		}
		res.redirect('/users/me');
	});
});

module.exports = router;
