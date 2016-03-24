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

	// TODO : use model???
	req.app.models.user.findAll({
		attributes : ['user', 'username', 'deleted_at'],
		order: ['deleted_at', ['username', 'ASC']],
		paranoid: false
	}).then(function(users){

		users = _.chain(users)
			.forEach(x => { x.is_root = x.username==='root'; })
			.forEach(x => { x.enabled = !x.deleted_at; })
			.map(_.partial(_.omit, _, 'deleted_at'))
			.value();

		debug(users);
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
		res.locals.__ = function(x){ return x; };

		res.locals.messages = _.concat([], req.flash('message'));
		res.render('users/create');
	})

	.post(function(req, res, next) {
		let u = res.locals.user;

		/* GET VALUES */
		let password2 = req.body.password2;
		let user = _(req.body)
			.pick(['username', 'password'])
			.value();

		let person = _(req.body)
			.pick(['name', 'surname', 'phone'])
			.value();

		if (user.password !== password2){
			req.flash('message', 'Passwords do not match!');
			res.redirect('back');
			return;
		}

		// TODO : use model???
		req.app.models.user.create(user)
			.then(function(){
				req.flash('message', 'User created!');
				res.redirect('/users/list');
			})
			.catch(function(err){
				res.locals.error = err;
				res.render('users/create');
			});
	});


router.route('/users/:user/enabled')
	.post(function(req, res, next) {
		var u = res.locals.user;

		var uid = parseInt(req.params.user);
		var state = JSON.parse(req.body.enabled);

		req.app.models.user.setState(uid, state)
			.catch(function(err){
				res.error = err;

				// error saved - go to next step
			})
			.then(function(){
				res.redirect('/users/list');
			});
	});


module.exports = router;
