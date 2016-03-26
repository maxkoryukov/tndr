var express = require('express');
var router = express.Router();
var debug    = require('debug')('tndr:routes:dashboard');

var baseurl = '';

/* GET home page - dashboard */
router.route(`${baseurl}/`)
	.get(function(req, res, next) {
		res.render('index', { title: 'Dashboard' });
	});

module.exports = router;
