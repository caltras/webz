var gulp = require('gulp');

gulp.task('html', function(){
    return gulp.src(['./src/view/**/*.*'])
        .pipe(gulp.dest('./dist/view'));
});
gulp.task('package.json', function(){
    return gulp.src(['./package.json'])
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default',['html','package.json']);