var gulp = require('gulp');
var del = require('del');

gulp.task('step1', function () {
    del([
        'MarkNote-win32-x64',
        'ele/*',
        '!ele/main.js',
        '!ele/package.json'
    ]).then(() => {
        gulp.src('angular-build/*')
        .pipe(gulp.dest('ele'));
    });
});

gulp.task('step2', function () {

    gulp.src('node_modules/imageinfo/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/imageinfo'));

    gulp.src('node_modules/sqlite3/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/sqlite3'));

    gulp.src('node_modules/md5/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/md5'));

    gulp.src('node_modules/crypt/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/crypt'));

    gulp.src('node_modules/charenc/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/charenc'));

    gulp.src('node_modules/is-buffer/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/is-buffer'));

    gulp.src('bin/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/bin'));

    gulp.src('database/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/database'));

    gulp.src('attached/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/attached'));

    gulp.src('logo.ico')
    .pipe(gulp.dest('./MarkNote-win32-x64/'))
    .pipe(gulp.dest('./MarkNote-win32-x64/resources/app/'));
});

gulp.task('step3', function () {
    del([
        'angular-build',
        'ele/*',
        '!ele/main.js',
        '!ele/package.json'
    ]);
});
