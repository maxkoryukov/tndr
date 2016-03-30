/*
 * @module tndr.routes.builder
 */

 "use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:builder');
var _        = require('lodash');
var promise  = require('bluebird');

var baseurl = '/builder';
let __ = x => x;

// -----------------------------------------------
// TODO : refactor section
// -----------------------------------------------

function _extend_model_for_card(db, ext, builder){
	ext = ext || {};

	return db.builder_category.findAll({
		order: ['sort']
	})
		.then(bc => {
			ext.builder_category = bc;
		})
		.then(() => ext);
}

// -----------------------------------------------

router.route(`${baseurl}/`)

	.delete(function(req, res, next) {

		let bid = JSON.parse(req.body.id);
		if (!_.isInteger(bid))
			next( new Error('Type error'));
		let db = req.app.models;
		let name = '<builder>';

		return db.builder.findById(bid, { raw: false} )
			.then(b => {
				name = b.name;
				return b.destroy();
			})
			.then(b => {
				res.json({
					message: __(`${name} deleted`),
					data: b
				});
				return;
			})
			.catch(err=>next(err))
		;
	})

	.post(function(req, res, next){
		let data = _.pick(req.body, [
			'name'
		]);
		data.builder_category_id = JSON.parse(req.body.builder_category);

		let db = req.app.models;

		let b = db.builder.build(data, {
			include : [db.builder_category]
		});

		b.save().then(b => {

				res.json({
					message: __('Successfully created'),
					data: b
				});
				return;
			})

			.catch(err=>next(err))
		;
	})

	.put(function(req, res, next){

		let data = _.pick(req.body, [
			'id', 'name'
		]);
		let bid = _.at(req.body, 'builder_category');

		let db = req.app.models;

		db.builder.findById(data.id, {
			raw: false,
			include: [db.builder_category]
		})
			.then(b => {
				b = _.assign(b, data);
				b.setBuilder_category(bid);
				return b.save();
			})
			.then(
				b => {
					return b.reload({
						raw: false,
						include: [db.builder_category]
					});
				}
				//b => b.reload()
			)
			.then(b => {
				b = b.get();
				res.json({
					message: __('Saved!'),
					data: b
				});
				return;
			})
			.catch(err=>{
				next(err);
			})
		;
	})
;

// -----------------------------------------------
// TODO : refactor section
// -----------------------------------------------
var _init_employees = function(emps){
	return _.chain(emps)
		.forEach( x=> { x.job = x.employee.job;} )
		.forEach( x=> {x.phone_link = x.getPhoneLink();} )
		.map( _.partial(_.pick, _, 'id', 'name', 'surname', 'phone', 'phone_link', 'note', 'job'))
		.value()
	;
}

var _api_load_builder_with_employees_promise = function(db, bid){
	return db.builder.findById(bid, {
		raw: false,
		include: [{
			model: db.person,
			as: 'employees',
		}],
		order: [
			[{model: db.person, as: 'employees'}, 'surname', 'ASC'],
			[{model: db.person, as: 'employees'}, 'name', 'ASC']
		]
	})
}

router.route(`${baseurl}/employees`)
	.get(function(req, res, next){

		let bid = JSON.parse(req.query.builder);
		if (!_.isInteger(bid))
			next( new Error('Type error'));

		let db = req.app.models;

		return _api_load_builder_with_employees_promise(db, bid)
			.then(b =>{
				let emps = _init_employees(b.employees);

				res.json({
					message: null,
					data: emps
				});
				return;
			})
			.catch(err=>{
				next(err);
			})
	})

	.unlink(function(req, res, next){

		let bid = JSON.parse(req.body.builder);
		if (!_.isInteger(bid))
			next( new Error('builder.id: Type error'));
		let eid = JSON.parse(req.body.employee);
		if (!_.isInteger(eid))
			next( new Error('employee.id: Type error'));

		let db = req.app.models;

		let bname = '<builder>';
		let ename = '<employee>';

		promise.all([
			_api_load_builder_with_employees_promise(db, bid),
			db.person.findById(eid)
		])
			.spread( (b, p) => {

				bname = b.name;
				ename = _.join([p.surname, p.name], ' ');
				return [b, b.removeEmployee(eid)];
			})
			.then((b, count) => {
				let emps = _init_employees(b.employees);

				res.json({
					message: __(`${ename} deleted from ${bname}`),
					data: emps
				});
				return;
			})
			.catch(err=>next(err))
	})
;


// --------------------------------------------------------------------

router.route(`${baseurl}/index`)
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
			.catch(err=> next(err))
		;
	});

router.route(`${baseurl}/create`)
	.get(function(req, res, next){
		let db = req.app.models;

		let b = db.builder.build({});
		return _extend_model_for_card(db)
			.then(ext => {

				let vm = _.assign(ext, {
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


		promise.all([
			// 1: b
			db.builder.findById(id, {
				raw: false,
				include: [{
						model: db.person,
						as: 'employees',
						through : db.employer
					},
					db.builder_category,
				],
			}),
			// 2: ext
			_extend_model_for_card(db)
		])
			.spread((b, ext) => {

				if (!b){
					throw new Error('Not found');
				}

				b.employees = _.chain(b.employees)
					.map(x => x.get())
					.forEach(x => x.job = x.employee.job)
					.value();

				let vm = _.assign(ext, {
					builder : b
				});

				res.render('builder/card', vm);
			})
			.catch(err => next(err));
	});

module.exports = router;
