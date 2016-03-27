/*
 * @module tndr.routes.builder
 */

 "use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:builder');
var _        = require('lodash');

var baseurl = '/builder';

router.route(`${baseurl}/`)

	.get(function(req, res, next) {
		let db = req.app.models;

		db.builder_category.findAll({
			raw: false,
			//attributes : ['builder_category', 'name', 'code', 'tip_usage'],
			include: [db.builder],
			order: ['sort']
		})
			.then(categories => {

				let categories = _.chain(categories)
					.forEach(x => { if (x.builder) x.builder = x.builder.get(); })
					.map(_.partial(_.pick, _, ['builder_category', 'name', 'code', 'tip_usage', 'tip_price', 'note', 'builders']))
					.value();

				res.render('builder/index', {categories : categories});
			})
			.catch(err=> next(err));
	});

router.route(`${baseurl}/:builder`)

	.get(function(req, res, next) {
		let db = req.app.models;

		let id = _.toNumber(req.params.builder);

		db.builder.findById(id, {
			raw: false,
			include: [{
				model: db.person,
				as: 'employees',
				through : db.employer
			}],
		})
			.then(b => {
				b.employees = _.chain(b.employees)
					.map(x => x.get())
					.forEach(x => x.job = x.employee.job)
					.value();
				res.render('builder/card', {builder : b});
			})
			.catch(err => next(err));
	});

module.exports = router;
