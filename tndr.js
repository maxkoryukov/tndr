/*
 * @module tndr
 */

 "use strict";

require('dotenv').config({silent: true});

var debug           = require('debug')('tndr');
var express         = require('express');
var path            = require('path');
var _               = require('lodash');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var flash           = require('connect-flash');
var handlebars      = require('express-handlebars');

var app             = express();

var promises        = require('bluebird');
promises.config({
	longStackTraces: true
});

var hbsReqHelpers   = require('./lib/mw/hbs-per-request-helpers');

debug('initializing');

/*
====================================
CONFIG
====================================
*/
app.config = require('./config');

/*
====================================
view engine setup
====================================
*/
let hbs  = handlebars.create({
	layoutsDir: 'views/layouts/',
	partialsDir: 'views/partials/',
	defaultLayout: 'main',
	helpers: require('./lib/hbs-helpers'),
	extname: '.hbs'
});
app.locals.hbs = hbs;

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.set('trust proxy', app.config.rproxy.trust_level || 0); // trust first (or nth-) proxy

app.use(favicon(path.join(__dirname, 'build', 'assets', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(app.config.cookie.secret));

app.use(flash());

/*
====================================
STATIC
====================================
*/
app.use(express.static(path.join(__dirname, 'build', 'assets')));

// File storage
app.use(
	app.config.models.storage.url_prefix,
	express.static(path.join(__dirname, app.config.models.storage.path))
);

/*
====================================
SESSIONS
====================================
*/

var session_config = {
	secret: app.config.cookie.secret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure : app.config.cookie.secure
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
	res.locals.current = req.current;
	next();
});

/*
====================================
DB and models
====================================
*/
var models = require('./models')(app.config.models);

models.init()

	// after DB ready, register DB-MW (should be registered before data access):

	.then(function db_ready (){
		app.use(function tndr_app_set_models(req, res, next){
			app.models = models;
			next();
		});
	})

	.then(function(){

		// register MW, which copy LOCAL HBS-helpers from
		// request to the HBS engine (for request handling time)
		app.use(hbsReqHelpers);
	/*
	====================================
	USER MESSAGES
	====================================
	*/
		var msgmw = require('./lib/mw/messages');
		app.use('/', msgmw);

	/*
	====================================
	LANG
	====================================
	*/

		var langmw = require('./lib/mw/lang');

		app.use('/:lang(\\w\\w)?:cult([-_]\\w\\w)?/', function tndr_app_set_lang_pre(req, res, next){

			let lc = langmw.parseCulture(req.params.lang, req.params.cult);
			req.current.lang = lc;

			next();
		}, langmw);


	/*
	====================================
	ROUTING
	====================================
	*/
		var login = require('./routes/login');
		langmw.use('/', login);

		var api       = require('./routes/api');

		var builder   = require('./routes/builder');
		var dashboard = require('./routes/dashboard');
		var tender    = require('./routes/tender');
		var user      = require('./routes/user');

		langmw.use('/', api);

		langmw.use('/', builder);
		langmw.use('/', dashboard);
		langmw.use('/', tender);
		langmw.use('/', user);

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
if (_.get(app.config, 'debug.render_stack')) {
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
