'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var gutil       = require('gulp-util');
var watchify    = require('watchify');
var buffer      = require('vinyl-buffer');
var sourcemaps  = require('gulp-sourcemaps');
var babelify    = require('babelify');


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
    debug: true
  });

  bundler.transform(babelify, {
    presets: ["es2015"],
    only: /src\/js/,
    sourceMaps: true
  });

  bundler.plugin(watchify, {
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

  bundler.on('update', function (ids) {
    bundle();

    ids.forEach(function (id) {
      gutil.log(gutil.colors.green('Updated:'), id);
    });
  });

});


// The default task
gulp.task('default', ['scripts', 'serve']);
