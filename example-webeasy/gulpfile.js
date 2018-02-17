var gulp = require('gulp');

gulp.task('package.json', function(){
    return gulp.src(['./package.json'])
        .pipe(gulp.dest('./dist/example-webeasy/src/'));
});

gulp.task('default',['package.json']);