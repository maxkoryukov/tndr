"use strict";

var debug           = require('debug')('tndr:tndr');
var express         = require('express');
var path            = require('path');
var _               = require('lodash');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var flash           = require('connect-flash');
// TODO : move to gulp
var lessmw          = require('less-middleware');

var models          = require('./models');
var view_partials   = require('./views/register-partials');

var app             = express();

var envname         = process.env.NODE_ENV || 'production';
var config          = require('./config/app.json')[envname];

// ALWAYS: print config, when it is read from ENV:
debug(`ENV: ${envname}`);

/*
====================================
CONFIG
====================================
*/
app.config = config;
if (!app.config.security) app.config.security = {};

let alid = app.config.security.autologin;
app.config.security.autologin = null;
if (_.isInteger(alid)){
	app.config.security.autologin = alid;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('trust proxy', config.rproxy.trust_level || 0); // trust first (or nth-) proxy

app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cookie.secret));

app.use(express.static(path.join(__dirname, 'assets')));

app.use(flash());
/*
====================================
LESS - DEPRECATED
TODO : move to gulp
====================================
*/

var lessopt = {
	dest : path.join(__dirname, 'assets'),
	debug : true,
};
var lesssrc = path.join(__dirname, 'billets');
app.use(lessmw(lesssrc, lessopt));

/*
====================================
SESSIONS
====================================
*/

var session_config = {
	secret: config.cookie.secret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure : config.cookie.secure
	},

};
app.use(session(session_config));


/*
====================================
CURRENT and running values for each
QUERY
====================================
*/
app.use(function tndr_app_set_current(req, res, next){
	req.current = {};
	next();
});

/*
====================================
DB
====================================
*/
models.init()

	// after DB ready, register DB-MW (should be registered before data access):

	.then(function db_ready (){
		app.use(function tndr_app_set_models(req, res, next){
			app.models = models;
			next();
		});
	})

	.then(function(){

	/*
	====================================
	LANG
	====================================
	*/

		var langmw = require('./mw/lang');

		app.use('/:lang(\\w\\w)?:cult([-_]\\w\\w)?/', function tndr_app_set_lang_pre(req, res, next){

			let lc = langmw.parseCulture(req.params.lang, req.params.cult);
			res.lang = lc;
			req.current.lang = lc;

			next();
		}, langmw);


	/*
	====================================
	ROUTING
	====================================
	*/

		var dashboard = require('./routes/dashboard');
		var users = require('./routes/users');
		var login = require('./routes/login');

		langmw.use('/', login);
		langmw.use('/', dashboard);
		langmw.use('/', users);

		// catch 404 and forward to error handler
		app.use(function tndr_handle_not_found(req, res, next) {
			// this handler should process all unhandled requests.
			if (!res.headersSent) {
				var err = new Error('Not Found');
				err.status = 404;
				next(err);
			} else {
				next();
			}
		});
	});

/*
====================================
error handlers
====================================
*/

// development error handler
// will print stacktrace
if (envname === 'dev') {
	app.use(function tndr_global_error_dev(err, req, res, next) {
		res.status(err.status || 500);
		return res.render('error', {
				message: err.message,
				error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function tndr_global_error(err, req, res, next) {
	res.status(err.status || 500);
	return res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
