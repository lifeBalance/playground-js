'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var gutil       = require('gulp-util');

// Static server
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("src/js/*.js", ['scripts']);
});

// The `scripts` task
gulp.task('scripts', function () {
  return browserify('src/js/main.js')
    .bundle()
    .on('error', function (e) {
      gutil.log(e);
    })
    .pipe(source('bundle.js')) // Creates in-memory vinyl file object.
    .pipe(gulp.dest('dist/public/js')) // Written to dist/public/js/bundle.js
    .pipe(browserSync.stream()); // Reload browser when bundle.js is written
});

// The default task
gulp.task('default', ['serve', 'scripts']);
