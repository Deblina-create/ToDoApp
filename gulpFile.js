const gulp = require('gulp');
const { src, series, parallel, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const htmlPath = 'src/*.html';
const jsPath = 'src/scripts/*.js';
const scssPath = 'src/styles/*.scss';
sass.compiler = require('node-sass');

// Copy All HTML files
function copyHtmlTask(){
    return src(htmlPath)
      .pipe(gulp.dest('dist'));
}

function copyJSTask(){
    return src(jsPath)
      .pipe(gulp.dest('dist/scripts'));
}




// Compile Sass
function sassTask(){
    return src('src/styles/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/styles'));
}
 


//watch for scss and html changes
function watchTask(){
  watch([htmlPath, scssPath, jsPath], { interval: 300 }, parallel(copyHtmlTask, copyJSTask, sassTask));
}






exports.copyHtml = copyHtmlTask;
exports.copyJS = copyJSTask;
exports.sass = sassTask;
exports.default = series(parallel(copyHtmlTask, copyJSTask, sassTask), watchTask);