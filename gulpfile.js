"use strict";

var gulp   = require('gulp');
var gutil  = require('gulp-util');

// plugins
var less         = require('gulp-less');
var rename       = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var csso         = require('gulp-csso');
var csslint      = require('gulp-csslint');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var zip          = require('gulp-zip');
var filesize     = require('gulp-size');
var gulpif       = require('gulp-if');
// var notify    = require('gulp-notify'),
// var minifycss = require('gulp-minify-css');
// var concat    = require('gulp-concat'),

// till open bug
// https://github.com/thirus/gulp-csslint-report/pull/5
// see thirus/gulp-csslint-report#5
// see #12
var csslint_reporter = require('./mods/DEP-gulp-csslint-report'); //require('gulp-csslint-report');

var del          = require('del');
var path         = require('path');
var debug        = require('debug')('tndr:gulpfile');

var _            = require('lodash');

/*
==============================================================================
ENV settings
==============================================================================
*/


var paths = {
	client:{
		style:[
			'billets/css/**/*.less',
		],
		script:[
			'billets/js/**/*.js'
		],
		favicon: [
			'billets/favicon.ico',
		],
		base : 'billets',
	},
	server:{
	},

	build:{
		dev: './dev',
		tmp: './dev/tmp/',
		assets: './assets',
		jshint: 'dev/jshint-report/index.html',
		csslint: './dev/csslint-report/',
	}
};

const filesize_opt = {showFiles:true, pretty:false};

var envname = process.env.NODE_ENV || 'production';
debug(`ENV: ${envname}`);

var isdevenv = _.toLower(envname) === 'dev';

/*
==============================================================================
TASKS
==============================================================================
*/

/*
=======================================
JS
=======================================
*/

gulp.task('js', () => {
	const size1 = filesize(filesize_opt);
	const size2 = filesize(filesize_opt);

	return gulp.src(paths.client.script, {base: paths.client.base})
		//.pipe(notify({message : "process file: <%= file.relative %>"}))
		.pipe(gulp.dest(paths.build.tmp))
		.pipe(size1)

		.pipe(rename({ suffix: '.min' }))
		.pipe(gulpif(!isdevenv, uglify()))

		.pipe(jshint())
		// TODO : remove path.join
		.pipe(jshint.reporter('gulp-jshint-html-reporter', {
			filename: paths.build.jshint,
			createMissingFolders: true,
		}))


		.pipe(gulp.dest(paths.build.assets))
		.pipe(size2)
		.on('error', gutil.log)
		//.pipe(notify({ onLast:true, message: 'CSS task complete' }))
	;
});

/*
=======================================
STYLES
=======================================
*/

gulp.task('less', () => {
	const size1 = filesize(filesize_opt);
	const size2 = filesize(filesize_opt);

	return gulp.src(paths.client.style, {base: paths.client.base})

		//.pipe(notify({message : "process file: <%= file.relative %>"}))
		.pipe(less())
		.pipe(gulp.dest(paths.build.tmp))
		.pipe(size1)
		//.pipe(concat('styles.css'))
		//.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(autoprefixer('last 2 version'))
		.pipe(rename({ suffix: '.min' }))
		////.pipe(minifycss())
		.pipe(gulpif(!isdevenv, csso()))

		.pipe(csslint())
		// TODO : remove path.join
		.pipe(csslint_reporter({
			directory: paths.build.csslint,
			filename: 'index.html',
			createMissingFolders: true,
		}))

		.pipe(gulp.dest(paths.build.assets))
		.pipe(size2)
		//.on('error', gutil.log)
		//.pipe(notify({ onLast:true, message: 'CSS task complete' }))
	;
});

// Fonts
gulp.task('fonts', () => {
	return gulp.src([
			'./node_modules/font-awesome/fonts/*',
	], {base: 'node_modules/font-awesome'})
		.pipe(gulp.dest(paths.build.assets))
	;
});

gulp.task('favicon', () => {
	return gulp.src(paths.client.favicon, {base: paths.client.base})
		.pipe(gulp.dest(paths.build.assets))
		.on('error', gutil.log)
	;
});

/*
=======================================
CLEAN
=======================================
*/

gulp.task('clean', () => {

	// will return a promise
	return del([
		paths.build.assets,
		paths.build.tmp,
	]);
});

/*
==============================================================================
META TASKS
==============================================================================
*/

function _zip(){
	return gulp.src([
		'./assets/**/*'
	])
		.pipe(zip('release.zip'))
		.pipe(gulp.dest('./build'))
		.pipe(filesize( filesize_opt ))
		.on('error', gutil.log)
	;
}

gulp.task('build', ['less', 'fonts', 'favicon', 'js']);

gulp.task('zip', ['build'], _zip);

gulp.task('default', ['build']);

gulp.task('start', () => {
	let cb = function(event) {
		debug('File ' + event.path + ' was ' + event.type + ', running tasks...');
	};

	gulp.watch(paths.client.script, ['js'], cb);
	gulp.watch(paths.client.style, ['less'], cb);

	let app = require('./bin/www');
});
