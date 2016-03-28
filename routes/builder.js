/*
 * @module tndr.routes.builder
 */

 "use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:builder');
var _        = require('lodash');

var baseurl = '/builder';

// -----------------------------------------------
// TODO : refactor section
// -----------------------------------------------

function _extend_model_for_card(db, ext, builder){
	ext = ext || {};

	return db.builder_category.findAll()
		.then(bc => {
			ext.builder_category = bc;
		})
		.then(() => ext);
}

// -----------------------------------------------

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

				categories = _.chain(categories)
					.forEach(x => { if (x.builder) x.builder = x.builder.get(); })
					.map(_.partial(_.pick, _, ['builder_category', 'name', 'code', 'tip_usage', 'tip_price', 'note', 'builders']))
					.value();

				res.render('builder/index', {categories : categories});
			})
			.catch(err=> next(err));
	})

	.delete(function(req, res, next) {

		let id = JSON.parse(req.body.id);
		debug(req.body);
		debug(req.body.id);

		if (!_.isInteger(id))
			next( new Error('Type error'));

		let db = req.app.models;

		return db.builder.findById(id, { raw: false} )
			.then(b=>{
				return b.destroy();
			})
			.then(b=>{
				res.json(null);
				return;
			})
			.catch(err=>{

				debug(err);
				next(err);
				//res.json({error:});
			})
		;
	})
;

router.route(`${baseurl}/create`)
	.get(function(req, res, next){
		let db = req.app.models;

		let b = db.builder.build({});
		return _extend_model_for_card(db)
			.then(x => {

				let vm = _.assign(x, {
					builder : b,
					create:true
				});

				res.render('builder/card', vm);
			});
	})
;

router.route(`${baseurl}/:builder`)

	.get(function(req, res, next) {
		let db = req.app.models;

		let id = _.toNumber(req.params.builder);


		[
			// 1: b
			db.builder.findById(id, {
				raw: false,
				include: [{
					model: db.person,
					as: 'employees',
					through : db.employer
				}],
			}),
			// 2: ext
			_extend_model_for_card(db)
		]
			.spread((b, ext) => {

				debug(b, ext);
				b.employees = _.chain(b.employees)
					.map(x => x.get())
					.forEach(x => x.job = x.employee.job)
					.value();


				res.render('builder/card', {builder : b});
			})
			.catch(err => next(err));
	});

module.exports = router;
