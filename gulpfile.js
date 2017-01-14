var gulp = require('gulp');
var sass = require('gulp-sass');
var fontAwesome = require('node-font-awesome');

var publicFolder = "./public/assets/";

gulp.task('fonts', function () {
    gulp.src(fontAwesome.fonts)
        .pipe(gulp.dest(publicFolder + 'fonts'));
});

gulp.task('scss', function () {
    gulp.src('./src/Resources/scss/index.scss')
        .pipe(sass({
            includePaths: [fontAwesome.scssPath]
        }))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(publicFolder + 'css'));
});

gulp.task('default', ['fonts', 'scss'], function () {
    gulp.watch('./src/Resources/scss/**/*.scss', ['scss']);
});