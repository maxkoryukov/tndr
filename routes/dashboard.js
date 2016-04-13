"use strict";

var express  = require('express');
var router   = express.Router();
var debug    = require('debug')('tndr:routes:dashboard');
var _        = require('lodash');
var promise  = require('bluebird');

var baseurl = '';

/* GET home page - dashboard */
router.route(`${baseurl}/`)
	.get(function(req, res, next) {

		let db = req.app.models;

		promise.all([
			db.tender.count({
				where: {}
			}),

			db.builder.count()
		])
		.spread( (tender_count, bcount) => {
			let vm = {};
			vm = _(vm)
				.set('tenders.total', tender_count)
				.set('builders.total', bcount)
				.set('title', 'Dashboard')
				.value();

			res.render('dashboard/index', vm);
		});
	});

module.exports = router;
