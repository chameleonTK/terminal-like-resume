const { watch, series, parallel } = require('gulp');
const { src, dest } = require('gulp');
const log = require('fancy-log');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
// const sh = require('shelljs');
const uglify = require('gulp-uglify');
const webserver = require('gulp-webserver');

function compileSCSS(cb) {
    return src([
        'assets/scss/*.scss',
    ])
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(concat('app.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('app.min.css'))
    .pipe(dest('css/'));
}

function compileJS(cb) {
    return src([
        'assets/js/app.js',
        'assets/js/**/*.js'
    ])
    .pipe(concat('app.js'))
    .pipe(dest('js/'))
    .pipe(uglify())
    .on('error', log.error)
    .pipe(rename('app.min.js'))
    .pipe(dest('js/'))
}


function compileLib(cb) {
    return src([
        'assets/lib/ngterminal/ngterminal.js',
        'assets/lib/ngterminal/**/*.js'
    ])
    .pipe(concat('ngterminal.js'))
    .pipe(dest('js/'))
    .pipe(uglify())
    .on('error', log.error)
    .pipe(rename('ngterminal.min.js'))
    .pipe(dest('js/'))
}

function runWebserver(cb) {
    return src("./")
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: false,
      fallback: "./index.html"
    }));
}


exports.build = series(compileLib, compileJS, compileSCSS);
exports.default = function() {
    runWebserver();
    watch('assets/js/**/*.js', compileJS);
    watch('assets/scss/*.scss', compileSCSS);
    watch('assets/lib/ngterminal/**/*.js', compileLib);
};

