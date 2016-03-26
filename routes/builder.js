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

				let cs = _.chain(categories)
					.forEach(x => { if (x.builder) x.builder = x.builder.get(); })
					.map(_.partial(_.pick, _, ['builder_category', 'name', 'code', 'tip_usage', 'tip_price', 'note', 'builders']))
					.value();

debug('----------------------------------------------------------------');
debug(cs);
				res.render('builder/index', {categories : cs});
			})
			.catch(err=> {
				next(err);
			});
	});

module.exports = router;
