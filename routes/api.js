"use strict";

let express  = require('express');
let router   = express.Router();
let debug    = require('debug')('tndr:routes:api');
let _        = require('lodash');

let baseurl = '/api';
//let __ = x => x;


/*
====================================
PARAM HANDLING
====================================
*/

router.param('entity', function(req, res, next, entity){

	debug('param entity = ', entity);

	entity = _.toString(entity);

	let db = req.app.models;

	// TODO : ensure, that it will redirect to "NOT FOUND" handler
	if (!_.has(db, entity)){
		return next(new Error('There is no such entity in database'));
	}

	// checking, that object has 'ID':
	//if (!_.has(db[entity], 'id')) {
	//	debug( db[entity]);
	//	throw new Error('The requested entity is not API-friendly');
	//}

	req.entity = db[entity];
	next();
});


router.route(`${baseurl}/:entity`)

	.get(function(req, res, next) {
		//let db = req.app.models;
		let entity = req.entity;

		entity.findAll({
			raw: false,
			//include: [db.person],
			//order: [['deleted_at', 'ASC'], ['username', 'ASC']],
			paranoid: false
		})
		.catch(err => next(err))
		.then(function(list){

			// TODO : post processing

			list = _.map(list, x => x.get());

			return res.json({
				data : list,
				message: 'ok',
			});

		})
	})

	// create new
	.post(function(req, res, next){
		//let db = req.app.models;
		let entity = req.entity;

		debug('post: entity = ', entity);

		let resdata = req.body.item;

		debug('post: raw item = ', resdata);

		return entity.create(resdata, {raw: false})
			.catch(err => next(err))
			.then(item => {

				debug('item created', item);

				if (item.setCreated_by){
					item.setCreated_by(req.current.user.id);
					return item.save();
				} else {
					return item;
				}
			})
			.then(item => {
				item = item.get();
				debug('post: item created', item);
				res.json(item);
			})
		;
	})


module.exports = router;
