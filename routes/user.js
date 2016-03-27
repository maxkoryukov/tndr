"use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:user');
var _        = require('lodash');

var baseurl = '/user';
var __ = x => x;

var _init_users = function(users){
	return _.chain(users)
		.map(x => { return x.get(); })
		.forEach(x => { x.is_root = x.username==='root'; })
		.forEach(x => { x.enabled = !x.deleted_at; })
		.forEach(x => { x.person.phone_link = x.person.getPhoneLink(); })
		.map(_.partial(_.omit, _, 'deleted_at'))
		.value();
};

/*
====================================
PARAM HANDLING
====================================
*/

router.param('user', function(req, res, next, id){

	let db = req.app.models;

	id = _.toNumber(id);

	db.user.findById(id, {
		raw: false,
		attributes : ['id', 'username', 'deleted_at'],
		include: [db.person],
		order: [['deleted_at', 'ASC'], ['username', 'ASC']],
		paranoid: false
	}).then(function(u){
		if (!u){
			next('user not found');
		} else {
			let users = _init_users([u]);
			u = users[0];
			req.user = u;
			next();
		}
	});
});

/*
====================================
ROUTES
====================================
*/

/* GET users listing. */
router.route(`${baseurl}/list`)

	.get(function(req, res, next) {
		let db = req.app.models;

		// TODO : use model???
		db.user.findAll({
			raw: false,
			attributes : ['id', 'username', 'deleted_at'],
			include: [db.person],
			order: [['deleted_at', 'ASC'], ['username', 'ASC']],
			paranoid: false
		})
		.then(function(users){

			users = _init_users(users);

			return res.render('user/list', { users : users });

		})
		.catch(err => {
			next(err);
		});
	});

router.route(`${baseurl}/change_password`)

	.post(function(req, res, next) {
		let db = req.app.models;

		var u = req.current.user;
		var un = u.username;

		var pw = req.body.passwordold;
		var pwn1 = req.body.passwordnew1;
		var pwn2 = req.body.passwordnew2;

		if (pwn1 !== pwn2){
			req.flash('message', 'New passwords do not match!');
			res.redirect('back');
			return;
		}

		db.user.changePassword(un, pw, pwn1)
			.catch( err => {
				req.flash('message', __('Old password is incorrect'));
				res.redirect('back');
			})
			.then( (result) => {
				req.flash('message', __('Password changed!'));
				res.redirect(`${baseurl}/me`);
			});
	});

router.route(`${baseurl}/create`)

	.get(function(req, res, next) {

		res.render('user/create');
		return;
	})

	.post(function(req, res, next) {
		/* GET VALUES */
		let password2 = req.body.password2;
		let user = _(req.body)
			.pick(['username', 'password'])
			.value();

		let person = _(req.body)
			.pick(['name', 'surname', 'phone'])
			.value();
		user.person = person;

		if (user.password !== password2){
			req.flash('message', 'Passwords do not match!');
			res.redirect('back');
			return;
		}

		// TODO : use model???
		req.app.models.user.create(user, {
			include: [req.app.models.person]
		})
			.then(function(){
				req.flash('message', 'User created!');
				res.redirect(`${baseurl}/list`);
				return;
			})
			.catch(function(err){
				res.locals.error = err;
				res.render('user/create');
				return;
			});
	});

router.route(`${baseurl}/me`)

	.get(function(req, res, next) {

		res.render('user/me');
	});

router.route(`${baseurl}/:user`)
	.get(function(req, res, next){

		res.render('user/card', { user: req.user});

	});

router.route(`${baseurl}/:user/enabled`)
	// TODO : replace with PATCH
	.post(function(req, res, next) {
		var state = JSON.parse(req.body.enabled);

		req.app.models.user.setState(req.user.id, state)
			.catch(function(err){
				res.error = err;

				// error saved - go to next step
			})
			.then(function(){
				res.redirect(`${baseurl}/list`);
				return;
			});
	});


module.exports = router;
