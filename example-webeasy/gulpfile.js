var gulp = require('gulp');

gulp.task('resources', function(){
    return gulp.src(['./src/public/**/*.*'])
        .pipe(gulp.dest('./dist/public'));
});
gulp.task('html', function(){
    return gulp.src(['./src/view/**/*.*'])
        .pipe(gulp.dest('./dist/view'));
});
gulp.task('package.json', function(){
    return gulp.src(['./package.json'])
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default',['resources','package.json','html']);