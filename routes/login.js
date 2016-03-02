var express = require('express');
var router = express.Router();
var logger = require('morgan');
var user = require('../model/user');

router.get('/login', function(req, res, next) {
	res.render('login', { r: req.query.r });
});

router.post('/login', function(req, res, next) {
	var id = user.authenticate('TODO:username', 'TODO: password');
	if (id && id > 0){
		req.session.userId = id;
		req.session.save();

		// TODO : fill address:
		r = null;
		url = '/';
		if (r){
			var b = new Buffer(r, 'base64');
			url = b.toString();
			if (!url.startsWith('/'))
				url = '/';
		};
		res.redirect(url);
	} else {
		res.render('login', { error: { message: 'Unknown user' }, r: req.query.r });
	}
});

router.post('/logout', function(req, res, next) {
	req.session.destroy();
	res.redirect('/');
});

/* REQUIRE AUTH for all other requests */
router.all('*', function (req, res, next){
	if (req.session && req.session.userId){
		next();
	} else {
		var b = new Buffer(req.originalUrl);
		var backurl64 = b.toString('base64');
		res.redirect(`/login?r=${backurl64}`);
	}
});

module.exports = router;
