const gulp        = require('gulp');
const del         = require('del');
const fs          = require('fs');
const verInfo     = fs.readFileSync('ele/package.json');
const verOBJ      = JSON.parse(verInfo.toString());
const minorVer    = parseInt(verOBJ.minor);
const newMinorVer = minorVer + 1;
const buildVer    = 'v'+verOBJ.version + '_' + newMinorVer;

const newVerObj = verOBJ;
newVerObj.minor = String(newMinorVer);

const newVerObjBuffer = new Buffer(JSON.stringify(newVerObj));

fs.writeFile('ele/package.json', newVerObjBuffer, function (err) {
    if(err) {
        console.error(err);
    } else {
        console.log('写入成功');
    }
});

gulp.task('step1', function () {
    del([
        'MarkNote-win32-x64',
        'ele/*',
        '!ele/main.js',
        '!ele/package.json'
    ]).then(() => {
        gulp.src('angular-build/*')
        .pipe(gulp.dest('ele/'+buildVer));
    });
});

gulp.task('step2', function () {
    
    gulp.src('node_modules/sqlite3/lib/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/sqlite3/lib'));
    
    gulp.src('node_modules/sqlite3/node_modules/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/sqlite3/node_modules'));
    
    gulp.src('node_modules/sqlite3/package.json')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/sqlite3'));
    
    gulp.src('node_modules/sqlite3/sqlite3.js')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/sqlite3'));

//    gulp.src('node_modules/sqlite3/**/*')
//    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/sqlite3'));

    gulp.src('node_modules/md5/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/md5'));

    gulp.src('node_modules/crypt/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/crypt'));

    gulp.src('node_modules/charenc/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/charenc'));

    gulp.src('node_modules/is-buffer/**/*')
    .pipe(gulp.dest('MarkNote-win32-x64/resources/app/node_modules/is-buffer'));

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
