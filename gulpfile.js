'use strict';

var gulp = require('gulp');
// 加载gulp插件
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

/**
 * Run a webserver (with LiveReload)
 */
gulp.task('server', function() {
    plugins.connect.server({
        root: '.',
        fallback: './index.html',
        port: 8080,
        livereload: true
    });
});

/**
 * Keep multiple browsers & devices in sync when building websites.
 */
gulp.task('browser-sync', function() {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

});

/**
 * Watching file change & rebuild
 */
gulp.task('watch', function() {

    gulp.watch(['src/**/*.js', 'docs/**/*.[js,html]'], ['build']);

});

/**
 * build Tasks
 */
gulp.task('build', function() {

    // cleanup previous builds
    gulp.src('dist/*.js', { read: false })
        .pipe(plugins.clean());

    // build js
    // yofc云一期项目需要将定制版的yofc-echarts一起打包
    gulp.src(['vendor/yofc-echarts/yofc-echarts.js', 'src/directive.js', 'src/util.js', 'src/theme.js', 'src/theme/*.js'])
        .pipe(plugins.removeUseStrict())
        .pipe(plugins.concat('angular-echarts.js'))
        .pipe(plugins.wrap('(function () {<%= contents %>})();'))
        .pipe(gulp.dest('dist'))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.uglify({ outSourceMap: true, mangle: true, report: 'gzip' }))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest('dist'));

});

/**
 * developing: rebuild after coding
 */
gulp.task('default', ['build', 'browser-sync', 'watch', 'server']);

/**
 * publish: build then bump version
 */
gulp.task('publish', ['build'], function() {

    // bump bower, npm versions
    gulp.src(['package.json', 'bower.json'])
        .pipe(plugins.bump())
        .pipe(gulp.dest('.'));

});