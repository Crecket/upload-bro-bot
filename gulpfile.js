var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('scss', function () {
    gulp.src('./src/Resources/scss/index.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('default', ['scss'], function () {
    gulp.watch('./src/Resources/scss/**/*.scss', ['scss']);
});