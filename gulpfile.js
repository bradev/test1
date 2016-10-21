
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    deleteEmpty = require('delete-empty');


var config = {
    jsConcatFiles: [
    ],
    buildFilesFoldersRemove:[
        'build/scss/',
        'build/**/*.js',
        '!build/**/*.min.js',
        'build/bower.json',
        'build/bower_components/',
        'build/maps/',
        'build/plugins/'
    ]
};


// ////////////////////////////////////////////////
// Log Errors
// // /////////////////////////////////////////////

function errorlog(err){
    console.error(err.message);
    this.emit('end');
}


// ////////////////////////////////////////////////
// Styles Tasks
// ///////////////////////////////////////////////

gulp.task('styles', function() {
    gulp.src('dev/scss/style.scss')
        .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'compressed'}))
            .on('error', errorlog)
            .pipe(autoprefixer({
                browsers: ['last 3 versions'],
                cascade: false
            }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('dev/css'))
        .pipe(reload({stream:true}));
});


// ////////////////////////////////////////////////
// HTML Tasks
// // /////////////////////////////////////////////

gulp.task('html', function(){
    gulp.src('dev/**/*.html')
    .pipe(reload({stream:true}));
});


// ////////////////////////////////////////////////
// Browser-Sync Tasks
// // /////////////////////////////////////////////

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./dev/"
        }
    });
});

// task to run build server for testing final app
gulp.task('build:serve', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        }
    });
});


// ////////////////////////////////////////////////
// Build Tasks
// // /////////////////////////////////////////////

// clean out all files and folders from build folder
gulp.task('build:cleanfolder', function (cb) {
    del([
        'build/**'
    ], cb);
});

// task to create build directory of all files
gulp.task('build:copy', ['build:cleanfolder'], function(){
    return gulp.src('dev/**/*/')
    .pipe(gulp.dest('build/'));
});

// task to removed unwanted build files
// list all files and directories here that you don't want included
gulp.task('build:remove', ['build:copy'], function (cb) {
    del(config.buildFilesFoldersRemove, cb);
});

gulp.task('build:delete-empty', ['build:remove'], function() {
    return deleteEmpty.sync('build/modules/'); // deletes empty directories
});

gulp.task('build', ['build:copy', 'build:remove', 'build:delete-empty']);


// ////////////////////////////////////////////////
// Watch Tasks
// // /////////////////////////////////////////////

gulp.task ('watch', function(){
    gulp.watch('dev/scss/**/*.scss', ['styles']);
    gulp.watch('dev/**/*.html', ['html']);
});


gulp.task('default', ['styles', 'html', 'browser-sync', 'watch']);
