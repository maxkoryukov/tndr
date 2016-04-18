"use strict";

var express         = require('express');
var router          = express.Router();

var _               = require('lodash');
var debug           = require('debug')('art:routes:lang');
var moment          = require('moment');

var default_language = 'en';
var default_culture = 'AU';

router.use(function(req, res, next) {
	debug('CURRENT LOCALE:', req.current.lang);

	moment.locale(req.current.lang.elang);

	return next();
});

router.parseCulture = function parseCulture(lang, cult){
	let tworeg = /[a-z]{2}/i;

	var l = {
		lang : lang || null,
		cult : cult || null,
	};

	if (l.lang) {
		l.lang = _.toLower(tworeg.exec(l.lang)[0]);
		l.elang = l.lang;
	} else {
		l.elang = default_language
	}

	if (l.cult){
		l.cult = _.toUpper(tworeg.exec(l.cult)[0]);
		l.ecult = l.cult;
	} else {
		l.ecult = default_culture;
	}

	l.href = l.lang || '';
	if (l.cult){
		l.href = l.href + '-' + l.cult;
	}
	if (l.href){
		l.href = '/' + l.href;
	}
	return l;
}

exports = module.exports = router;
