'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var gutil       = require('gulp-util');
var watchify    = require('watchify');
var buffer      = require('vinyl-buffer');
var sourcemaps  = require('gulp-sourcemaps');

// Static server
gulp.task('serve', function() {
  browserSync.init({
    open: false,
    logFileChanges: false,
    server: {
      baseDir: "./dist",
    }
  });
});


// The `scripts` task
gulp.task('scripts', function () {
  var bundler = browserify({
    entries: ['src/js/main.js'],
    cache: {},
    packageCache: {},
    plugin: [watchify],
    debug: true
  });

  bundler.plugin(watchify, {
    delay: 100,
    ignoreWatch: ['**/node_modules/**'],
    poll: false
  });

  function bundle () {
    return bundler
      .bundle()
      .on('error', function (err) {
        gutil.log(gutil.colors.red('Browserify error:'), err.message);
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('../maps'))
      .pipe(gulp.dest('dist/public/js'))
      .pipe(browserSync.stream());
  }

  bundle(); // We have to call bundle() to get `update' events.
  bundler.on('update', bundle);
  bundler.on('log', function (e) {
    gutil.log(gutil.colors.green('Browserified!'), e);
  });
});


// The default task
gulp.task('default', ['scripts', 'serve']);
