var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pug = require('gulp-pug');
var template = require('gulp-template');
var dotenv = require('dotenv');

var environments = {
  "development" : {
	API_URL: "http://localhost:1337/",
	URL_WINDOW: "http://localhost:3000/"
  },
  "production" : {
	API_URL: "https://x8bit.com/pushing/api/",
	URL_WINDOW: "https://x8bit.com/pushing/"
  }
}

var environment = environments["production"];
if (process.argv.length > 2){
  environment = environments["development"]
}

dotenv.load();

environment.API_KEY = process.env.API_KEY;
environment.AUTH_DOMAIN = process.env.AUTH_DOMAIN;
environment.DATABASE_URL = process.env.DATABASE_URL;
environment.STORAGE_BUCKET = process.env.STORAGE_BUCKET;
environment.MESSAGING_SENDER_ID = process.env.MESSAGING_SENDER_ID;

gulp.task('less', function() {
	return gulp.src(['app/less/**/*.less'])
		.pipe(less())
		.pipe(concat('app.min.css'))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('vendor-css', function() {
	return gulp.src([
			'node_modules/materialize-css/dist/css/**/*.min.css',
		])
		.pipe(concat('vendor.min.css'))
		.pipe(gulp.dest('build/css'))
});

gulp.task('vendor-js', function() {
	return gulp.src([
			'node_modules/jquery/dist/**/*.min.js',
			'node_modules/materialize-css/dist/js/**/*.min.js',
			'node_modules/firebase/firebase.js'
		])
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('build/js'))
});


gulp.task('js', function() {
	return gulp.src('app/js/*.js')
		.pipe(uglify())
		.pipe(template(environment))
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest('build/js'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('pug', function () {
  return gulp.src(['app/index.pug'])
	.pipe(pug())
	.pipe(gulp.dest('build/'))
	.pipe(browserSync.reload({
		stream: true
	}))
	
});

gulp.task('copy-fonts', function() {
	gulp.src([
		'node_modules/materialize-css/dist/fonts/roboto/*.*'
	])
	.pipe(gulp.dest('build/fonts/roboto'))
});

gulp.task('copy-images', function() {
	gulp.src([
		'app/img/*.*'
	])
	.pipe(gulp.dest('build/img'))
});

gulp.task('copy-files', function() {
	gulp.src([
		'app/manifest.json',
		'app/firebase-messaging-sw.js'
	])
	.pipe(template(environment))
	.pipe(gulp.dest('build/'))
});

gulp.task('default', ['vendor-css', 'vendor-js', 'less', 'js', 'pug', 'copy-fonts', 'copy-images', 'copy-files']);

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'build'
		},
	})
});


gulp.task('dev', ['browserSync', 'vendor-css', 'vendor-js', 'less', 'js', 'pug', 'copy-fonts', 'copy-images', 'copy-files'], function() {
	gulp.watch('app/less/*.less', ['less']);
	gulp.watch('app/js/*.js', ['js']);
	gulp.watch('app/*.pug', ['pug']);
	gulp.watch('app/*.pug', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});
