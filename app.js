var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var flash        = require('connect-flash');
// TODO : move to gulp
var lessmw       = require('less-middleware');

var app          = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// TODO : set secret from file
app.use(cookieParser('TODO: set secret from file'));

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
	// TODO : set secret from file
	secret: 'tldrnald',
	resave: false,
	saveUninitialized: false,
	cookie: {},
};

if (app.get('env') !== 'development') {
	app.set('trust proxy', 1); // trust first proxy
	session_config.cookie.secure = true; // serve secure cookies
}

app.use(session(session_config));

/*
====================================
ROUTING
====================================
*/

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');

app.use('/', login);
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	// this handler should process all unhandled requests.
	if (!res.headersSent) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	} else {
		next();
	}
});

/*
====================================
error handlers
====================================
*/

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
				message: err.message,
				error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
