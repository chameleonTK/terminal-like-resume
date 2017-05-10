var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

gulp.task('scss', function() {
    return gulp.src([
          'assets/scss/*.scss',
        ])
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(concat('app.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('css/'));
});

// Concatenate & Minify JS
gulp.task('js', function() {
    return gulp.src([
            'assets/js/app.js',
            'assets/js/**/*.js'
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('js/'))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('js/'));
});

gulp.task('lib', function() {
    return gulp.src([
            'assets/lib/ngterminal/ngterminal.js',
            'assets/lib/ngterminal/**/*.js'
        ])
        .pipe(concat('ngterminal.js'))
        .pipe(gulp.dest('js/'))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(rename('ngterminal.min.js'))
        .pipe(gulp.dest('js/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('assets/js/**/*.js', ['js']);
    gulp.watch('assets/scss/*.scss', ['scss']);
    gulp.watch('assets/lib/ngterminal/**/*.js', ['lib']);
});

// Default Task
gulp.task('default', ['scss','js', 'watch', "lib"]);