var gulp   = require('gulp');
var gutil  = require('gulp-util');

var zip    = require('gulp-zip');

// plugins
var less         = require('gulp-less');
var rename       = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var csso         = require('gulp-csso');
var csslint      = require('gulp-csslint');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');

var filesize     = require('gulp-size');
var clean        = require('gulp-clean');

var csslint_reporter = require('gulp-csslint-report');

var path         = require('path');

// var notify    = require('gulp-notify'),
// var minifycss = require('gulp-minify-css');
// var concat    = require('gulp-concat'),

//var del = require('del');

var devdir = path.join('./', 'dev') + path.sep;
var tmpdir = path.join('./', 'dev', 'tmp')+ path.sep;

/*
=======================================
JS
=======================================
*/

gulp.task('js', () => {
	const size1 = filesize( {showFiles:true, pretty:false} );
	const size2 = filesize( {showFiles:true, pretty:false} );

	return gulp.src([
			'./billets/js/**/*.js',
	])
		//.pipe(notify({message : "process file: <%= file.relative %>"}))
		.pipe(gulp.dest(tmpdir))
		.pipe(size1)

		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())

		.pipe(jshint())
		// TODO : remove path.join
		.pipe(jshint.reporter('gulp-jshint-html-reporter', {
			filename: path.join(devdir, 'jshint-report', 'index.html'),
			createMissingFolders: true,
		}))


		.pipe(gulp.dest('./assets/js'))
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
	const size1 = filesize( {showFiles:true, pretty:false} );
	const size2 = filesize( {showFiles:true, pretty:false} );

	return gulp.src([
			'./billets/css/**/*.less',
	])
		//.pipe(notify({message : "process file: <%= file.relative %>"}))
		.pipe(less())
		.pipe(gulp.dest(tmpdir))
		.pipe(size1)
		//.pipe(concat('styles.css'))

		//.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		//.pipe(autoprefixer('last 2 version'))
		.pipe(rename({ suffix: '.min' }))
		////.pipe(minifycss())
		//.pipe(csso())

		.pipe(csslint())
		// TODO : remove path.join
		.pipe(csslint_reporter({
			directory: path.join(devdir, 'csslint-report/'),
			createMissingFolders: true,
		}))

		.pipe(gulp.dest('./assets/css'))
		.pipe(size2)
		.on('error', gutil.log)
		//.pipe(notify({ onLast:true, message: 'CSS task complete' }))
	;
});

// Styles
gulp.task('fonts', () => {
	return gulp.src([
			'./node_modules/font-awesome/fonts/*',
	])
		.pipe(gulp.dest('./assets/fonts'))
	;
});

gulp.task('favicon', () => {
	return gulp.src([
			'./billets/favicon.ico',
	])
		.pipe(gulp.dest('./assets/'))
		.on('error', gutil.log)
	;
});

/*
=======================================
CLEAN
=======================================
*/

gulp.task('clean', () => {
	return gulp.src([
		'./assets',
		tmpdir,
	],{
		read: false
	})
		.pipe(clean())
		.on('error', gutil.log)
	;
});

/*
=======================================
META TASKS
=======================================
*/

function _zip(){
	return gulp.src([
		'./assets/**/*',
		tmpdir,
	])
		.pipe(zip('release.zip'))
		.pipe(gulp.dest('./build'))
		.pipe(filesize( {showFiles:true, pretty:false} ))
		.on('error', gutil.log)
	;
}

gulp.task('build', ['less', 'fonts', 'favicon', 'js']);

gulp.task('zip', ['build'], _zip);

gulp.task('default', ['build']);
