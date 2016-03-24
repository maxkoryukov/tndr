"use strict";

var express         = require('express');
var router          = express.Router();

var debug           = require('debug')('tndr:mw.lang');

var default_language = 'en';
var default_culture = 'AU';

router.use(function(req, res, next) {
	debug('LOCALE SETTINGS:', req.lang);
	next();
	return;
});

router.parseCulture = function parseCulture(lang, cult){
	var l = {
		lang : lang,
		cult : cult,
	};

	l.elang = l.lang || default_language;

	if (l.cult){
		l.cult = /[a-z]{2}/i.exec(l.cult)[0];
		l.ecult = l.cult;
	} else {
		l.ecult = default_culture;
	}

	return l;
}

module.exports = router;
