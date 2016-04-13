"use strict";

// HACK : play with env (for dev)
try { require('dotenv').config(); } catch (e) {} // eslint-disable-line

var gulp   = require('gulp');

// plugins
var less         = require('gulp-less');
var rename       = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var csso         = require('gulp-csso');
var csslint      = require('gulp-csslint');
var csslint_rep  = require('gulp-csslint-report');

var jslint       = require('gulp-eslint');
var jslint_rep   = require('eslint-html-reporter');
var uglify       = require('gulp-uglify');
var zip          = require('gulp-zip');
var filesize     = require('gulp-size');
var gulpif       = require('gulp-if');
// var notify    = require('gulp-notify'),
// var minifycss = require('gulp-minify-css');
// var concat    = require('gulp-concat'),

var fs           = require('fs');
var del          = require('del');
var path         = require('path');
var debug        = require('debug')('tndr:gulpfile');
var mkdirp       = require('mkdirp-bluebird');

var _            = require('lodash');

/*
==============================================================================
ENV settings
==============================================================================
*/

var paths = {
	client:{
		style:[
			'src/assets/css/**/*.less',
		],
		script:[
			'src/assets/js/**/*.js'
		],
		favicon: [
			'src/assets/favicon.ico',
		],
		base : 'src/assets',
	},
	server:{
		script: [
		],
	},

	build:{
		dev: './dev',
		tmp: './dev/tmp/',
		assets: 'build/assets',

		root: './build',
		jslint: 'dev/jslint-report/',
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

gulp.task('js:client:pre', () => {
	return gulp
		.src([
			'./node_modules/jquery/dist/jquery.min.js',
			'./node_modules/lodash/lodash.min.js',
			'./node_modules/handlebars/dist/handlebars.min.js',
			'./node_modules/knockout/build/output/knockout-latest.js',
			'./node_modules/knockout-mapping/dist/knockout.mapping.min.js',
			'./node_modules/knockout-mapping/dist/knockout.mapping.min.js.map',
			'./node_modules/form-serializer/dist/jquery.serialize-object.min.js',
		])
		// TODO : fix path
		.pipe(gulp.dest(path.join(paths.build.assets,'js')))
		.pipe(filesize(filesize_opt))
	;
});

gulp.task('js:client:my', () => {
	const size1 = filesize(filesize_opt);
	const size2 = filesize(filesize_opt);

	return mkdirp(path.dirname(paths.build.jslint)).then( () => {
		return gulp.src(paths.client.script, {base: paths.client.base})

			//.pipe(notify({message : "process file: <%= file.relative %>"}))
			.pipe(jslint())
			// TODO : remove path.join
			.pipe(jslint.format(
				jslint_rep,
				results => fs.writeFileSync(path.join(paths.build.jslint, 'client.html'), results)
			))

			.pipe(gulp.dest(paths.build.tmp))
			.pipe(size1)

			.pipe(rename({ suffix: '.min' }))
			.pipe(gulpif(!isdevenv, uglify()))

			.pipe(jslint())
			// TODO : remove path.join
			.pipe(jslint.format(
				jslint_rep,
				results => fs.writeFileSync(path.join(paths.build.jslint, 'client.min.html'), results)
			))

			.pipe(gulp.dest(paths.build.assets))
			.pipe(size2)
			.on('error', debug)
			//.pipe(notify({ onLast:true, message: 'CSS task complete' }))
	});
});

gulp.task('js:client', ['js:client:pre', 'js:client:my']);

gulp.task('js:server', () => {
	const size1 = filesize(filesize_opt);
	const size2 = filesize(filesize_opt);

	return mkdirp(path.dirname(paths.build.jslint)).then( () => {
		return gulp.src(paths.client.script, {base: paths.client.base})
			//.pipe(notify({message : "process file: <%= file.relative %>"}))
			.pipe(gulp.dest(paths.build.tmp))
			.pipe(size1)

			.pipe(rename({ suffix: '.min' }))
			.pipe(gulpif(!isdevenv, uglify()))

			.pipe(jslint())
			// TODO : remove path.join
			.pipe(jslint.format(
				jslint_rep,
				results => fs.writeFileSync(path.join(paths.build.jslint, 'server.html'), results)
			))

			.pipe(gulp.dest(paths.build.assets))
			.pipe(size2)
			.on('error', debug)
			//.pipe(notify({ onLast:true, message: 'CSS task complete' }))
	});
});

gulp.task('js', ['js:client']);

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
		// DONE : remove path.join
		.pipe(csslint_rep({
			directory: paths.build.csslint,
			filename: 'index.html',
			createMissingFolders: true,
		}))

		.pipe(gulp.dest(paths.build.assets))
		.pipe(size2)
		//.on('error', debug)
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
		.on('error', debug)
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
		.on('error', debug)
	;
}

gulp.task('build', ['less', 'fonts', 'favicon', 'js']);

gulp.task('zip', ['build'], _zip);

gulp.task('default', ['build']);

gulp.task('start', ['build'], () => {
	let cb = function(event) {
		debug('File ' + event.path + ' was ' + event.type + ', running tasks...');
	};

	gulp.watch(paths.client.script, ['js:client:my'], cb);
	gulp.watch(paths.client.style, ['less'], cb);

	//let app = 
	require('./bin/www');
});
