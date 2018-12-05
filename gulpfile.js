var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    notify = require("gulp-notify"),
    fileinclude = require('gulp-file-include'),
    rigger = require('gulp-rigger'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');


var PATH = {
    dst: 'dist/',
    src: 'src/'
};

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: PATH.dst
        }
    })
});

gulp.task('styles', function () {
    return gulp.src(PATH.src + 'styles/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on("error", notify.onError()))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(cleancss({level: {1: {specialComments: 0}}})) // Opt., comment out when debugging
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(PATH.dst + 'css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function () {
    return gulp.src([
        './node_modules/jquery/dist/jquery.js',
        './node_modules/owl.carousel/dist/owl.carousel.js',
        "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
        PATH.src + 'js/**/*.js'
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rigger())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(PATH.dst + 'js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('fonts', function () {
    return gulp.src([PATH.src + 'fonts/**/*'])
        .pipe(gulp.dest(PATH.dst + 'fonts'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function () {
    return gulp.src(PATH.src + 'templates/**/*.html')
        .pipe(plumber())
        .pipe(rigger())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(PATH.dst))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('imagemin', function () {
    return gulp.src(PATH.src + 'images/**/*')
        .pipe(cache(imagemin())) // Cache Images
        .pipe(gulp.dest(PATH.dst + 'images'));
});

gulp.task('webfonts', function () {
    return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest(PATH.dst + 'webfonts'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('json', function () {
    return gulp.src(PATH.src + "js/*.json" )
        .pipe(gulp.dest(PATH.dst))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('watch', ['styles', 'js', 'fonts', 'imagemin', 'html', 'webfonts', 'browser-sync', "json"], function () {
    gulp.watch([PATH.src + 'styles/**/*.scss'], ['styles']);
    gulp.watch([PATH.src + 'templates/**/*.html'], ['html']);
    gulp.watch([PATH.src + 'js/**/*.js'], ['js']);
    gulp.watch([PATH.src + 'fonts/**/*'], ['fonts']);
    gulp.watch([PATH.src + 'img/**/*'], ['imagemin']);
});


gulp.task('default', ['watch']);
