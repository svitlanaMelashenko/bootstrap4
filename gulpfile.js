const {src, dest, task, series, watch} = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const tinypng = require('gulp-tinypng-compress');
var browserSync = require('browser-sync').create();

function minify() {
    return src('src/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist'));
};

function tinyPng () {
    return src('./src/images/**/*.{png,jpg,jpeg}')
    .pipe(tinypng({
        key: 'X4e5ZdPeS8xd8i3onrp9YYhwukmGGl8r',
        sigFile: 'images/.tinypng-sigs',
        log: true
    }))
    .pipe(gulp.dest('./dist/images'));
};

function sassTask () {
    return src('./src/styles/**/*.scss')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('style.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest('./dist/css'))
};

task('default', series(tinyPng, minify, sassTask))

let serverTask = () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
};

exports.serve = () => {
    serverTask();
    watch('src/styles/*.scss', sassTask).on('change', browserSync.reload);
    watch('src/*.html', minify).on('change', browserSync.reload);
}