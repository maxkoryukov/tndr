"use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:api');
var _        = require('lodash');

var baseurl = '/api';
var __ = x => x;


/* GET users listing. */
router.route(`${baseurl}/:entity`)

	.get(function(req, res, next) {
		let db = req.app.models;

		let entity = req.params.entity;

		// TODO : ensure, that it will redirect to "NOT FOUND" handler
		if (!_.has(db, entity)){
			return next();
		}

		// checking, that object has 'ID':
		if (!_.has(db[entity], 'id')) {
			return next();
		}

		// TODO : use model???
		db[entity].findAll({
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
	});


module.exports = router;
