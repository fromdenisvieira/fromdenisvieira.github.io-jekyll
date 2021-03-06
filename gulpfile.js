var gulp = require('gulp'),
        sass = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        minifycss = require('gulp-minify-css'),
        rename = require('gulp-rename');

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 4002}));
  app.use(express.static(__dirname+"/_site"));
  app.listen(4000);
      console.log("\n" +
        "===============================================\n" +
        " Application running at: http://localhost:4000 \n" +
        "===============================================\n"
    );
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('styles', function() {
      return gulp.src(__dirname + "/css/scss/clean-blog-sass.scss")
        .pipe(sass({
            errLogToConsole: true,
            includePaths: [
                __dirname + "/css/scss"
            ],
            outputStyle: "expanded"
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest('./css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
  gulp.watch('css/scss/*.scss', ['styles']);
  gulp.watch('./*.html', notifyLiveReload);
  gulp.watch('./css/*.css', notifyLiveReload);
});

gulp.task('default', ['styles', 'express', 'livereload', 'watch'], function() {

});
