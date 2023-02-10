const autoprefixer = require('gulp-autoprefixer');
const gulp = require('gulp');
const concat = require('gulp-concat');
const copy = require('gulp-copy');
const cleanCSS = require('gulp-clean-css');
const insert = require('gulp-insert');
const clone = require('gulp-clone');
const notify = require('gulp-notify');
const pug = require('gulp-pug');
const header = require('gulp-header');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const gulpSass = require('gulp-sass');
const dartSass = require('sass');
const sourcemaps = require("gulp-sourcemaps");
const mergeStream =   require('merge-stream');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');

const tsProjectBrowser = ts.createProject('./js/src/browser/tsconfig.browser.json', {outFile: 'universal-material.js'});
const tsProjectBrowserUglify = ts.createProject('./js/src/browser/tsconfig.browser.json', {outFile: 'universal-material.min.js'});

const sass = gulpSass(dartSass);

const sassFilesPaths = ['./scss/universal-material.scss', './scss/universal-material-no-reboot.scss']

const buildSass = () => {
  const baseStreams = [];

  for (const path of sassFilesPaths) {
    let streamWithTheme = gulp
      .src(path)
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(autoprefixer());

    let streamNoTheme = gulp
      .src(path)
      .pipe(header('$include-default-theme: false;\n'))
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(rename({suffix: '-no-theme'}))
      .pipe(autoprefixer());

    baseStreams.push(streamWithTheme);
    baseStreams.push(streamNoTheme);
  }

  const targetStreams = [];

  for (const baseStream of baseStreams) {
    targetStreams.push(baseStream
      .pipe(clone())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./dist/css")));
    targetStreams.push(baseStream
      .pipe(clone())
      .pipe(cleanCSS())
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./dist/css")));
  }

  return mergeStream(targetStreams);
}

const sassDocs = () => {
  return gulp
    .src("./docs/src/css/docs.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./docs/dist/css"));
}

const pugDocs = () => {
  return gulp
    .src(["./docs/src/**/*.pug", "!./docs/src/layout.pug"])
    .pipe(pug({
      data: {
        debug: true,
        version:
          "<%= pkg.version + '.' + pkg.build %>"
      },
      pretty: true
    }).on("error", notify.onError(function (error) {
      return "An error occurred while compiling pug.\nLook in the console for details.\n" + error;
    })))
    .pipe(gulp.dest("./docs/dist")); // tell gulp our output folder
}

const jsCompileBrowserConfig = (tsProject) => {
  return gulp
    .src(['./js/src/browser/quick-dialog.ts', './js/src/browser/*.ts', '!./js/src/browser/index.ts'])
    .pipe(replace(/import\s{.+}\sfrom\s['"].+['"];/g, ''))
    .pipe(sourcemaps.init())
    .pipe(concat('universal-material.ts'))
    .pipe(insert.transform(contents => {
      return `namespace umd { ${contents} }`;
    }))
    .pipe(tsProject());
}

const jsCompileBrowser = () => {
  return jsCompileBrowserConfig(tsProjectBrowser)
    .pipe(gulp.dest("./dist/js/browser"))
    .pipe(gulp.dest("./docs/dist/js"))
}

const jsCompileBrowserUglify = () => {
  return jsCompileBrowserConfig(tsProjectBrowserUglify)
    .pipe(uglify())
    .pipe(gulp.dest("./dist/js/browser"))
}

const watchDefault = () => {
  gulp.watch(['./docs/src/**/*.pug', './docs/src/**/*.html'], exports['pug:docs']);
  gulp.watch('./scss/**/*.scss', exports['sass']);
  gulp.watch(['./docs/src/css/**/*.scss', './scss/**/*.scss'], exports['sass:docs']);
  gulp.watch('./js/src/*.ts', exports['scripts']);
}

const watchDocs = () => {
  gulp.watch(['./docs/src/**/*.pug', './docs/src/**/*.html'], exports['pug:docs']);
  gulp.watch(['./docs/src/css/**/*.scss', './scss/**/*.scss'], exports['sass:docs']);
}

const watchSass = () => {
  gulp.watch('./scss/**/*.scss', exports['sass']);
}

exports['sass:docs'] = sassDocs;

exports['pug:docs'] = pugDocs;

exports['js-compile-browser'] = jsCompileBrowser;
exports['js-compile-browser-uglify'] = jsCompileBrowserUglify;

exports['watch'] = watchDefault;
exports['watch:docs'] = watchDocs;
exports['watch:sass'] = watchSass;

exports.sass = buildSass;

exports.scripts = gulp.parallel(
  exports['js-compile-browser'],
  exports['js-compile-browser-uglify'])

exports.default = gulp.parallel(
  exports['sass'],
  exports['scripts'],
  exports['pug:docs'],
  exports['sass:docs'],
  exports['watch'])

exports.docs = gulp.parallel(
  exports['pug:docs'],
  exports['sass:docs'],
  exports['watch:docs'])
