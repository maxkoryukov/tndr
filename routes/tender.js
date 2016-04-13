/*
 * @module tndr.routes.tender
 */

 "use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:tender');
var _        = require('lodash');

var baseurl = '/tender';

router.route(`${baseurl}/wizard`)
	.get(function(req, res, next){
		let db = req.app.models;

		return res.render('tender/wizard');
	})

router.route(`${baseurl}/:id`)
	.get(function(req, res, next){

		if (! req.params.id.match( /\d+/ )) {
			return next();
		}

		let id = _.toInteger(req.params.id);

		debug('tender by id: ', id);

		next('not implemented');
	})

router.route(`${baseurl}/:state?`)

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
				return res.render('tender/index', tenders);
			})
		;
	})

exports = module.exports = router;
