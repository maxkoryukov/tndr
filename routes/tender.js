/*
 * @module tndr.routes.tender
 */

 "use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:tender');
var _        = require('lodash');

var baseurl = '/tender';

router.route(`${baseurl}/`)

	.get(function(req, res, next) {
		let db = req.app.models;

		debug('tender get index');

		db.tender.findAll({
			raw: false,
			where: {
			},
		})
			.catch(err => next(err))
			.then(tenders => {
				tenders = _.map(x => x.get());
				return res.render('tender/index', tenders);
			})
		;
	})

router.route(`${baseurl}/wizard`)
	.get(function(req, res, next){
		let db = req.app.models;

		return res.render('tender/wizard');
	})

router.route(`${baseurl}/:id`)
	.get(function(req, res, next){
		let db = req.app.models;

		if (! req.params.id.match( /\d+/ )) {
			return next();
		}

		let id = _.toLength(req.params.id);

		debug('tender by id: ', id);

		db.tender.findById(id, {
			raw: false
		})
		.catch(err => next(err))
		.then( tender => {
			tender = tender.get();

			// TODO : load files:
			tender.files = [{ fullname : 'readme.txt'}];
			return res.render('tender/card', { tender : tender });
		});
	})

router.route(`${baseurl}/:state`)

	.get(function(req, res, next) {
		let db = req.app.models;

		let state = req.params.state;
		if (!_.includes(['active'], state)){
			debug(`tender get, state ${state} is unknown, fallback to "active"`);
			state = 'active';
			return res.redirect(`${baseurl}/${state}`);
		}

		debug('tender get state = ', state);
		//res.render('tender/me');

		db.tender.findAll({
			raw: false,
			where: {
				'name': state
			},
		})
			.catch(err => next(err))
			.then(tenders => {
				tenders = _.map(x => x.get());
				return res.render('tender/state', tenders);
			})
		;
	})

exports = module.exports = router;
