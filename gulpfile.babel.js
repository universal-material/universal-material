import autoprefixer from 'gulp-autoprefixer';
import gulp from 'gulp';
import concat from 'gulp-concat';
import debug from 'gulp-debug';
import insert from 'gulp-insert';
import notify from "gulp-notify";
import pug from 'gulp-pug';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import sass from 'gulp-sass';
import sourcemaps from "gulp-sourcemaps";
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify';
import rollupTypescript from 'rollup-plugin-typescript2';
const rollup = require('rollup');

const tsProjectTypings = ts.createProject('./js/src/tsconfig.types.json');
const tsProjectBrowser = ts.createProject('./js/src/tsconfig.browser.json', {outFile: 'universal-material.js'});
const tsProjectBrowserUglify = ts.createProject('./js/src/tsconfig.browser.json', {outFile: 'universal-material.min.js'});

gulp.task("sass:normal", function () {
  return gulp.src("./scss/universal-material.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/css"))
    .pipe(gulp.dest("./docs/css"));
});

gulp.task("sass:compressed", function () {
  return gulp.src("./scss/universal-material.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "compressed"
    }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(rename("universal-material.min.css"))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/css"));
});

gulp.task("sass-no-reboot:normal", function () {
  return gulp.src("./scss/universal-material-no-reboot.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/css"))
    .pipe(gulp.dest("./docs/css"));
});

gulp.task("sass-no-reboot:compressed", function () {
  return gulp.src("./scss/universal-material-no-reboot.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "compressed"
    }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(rename("universal-material-no-reboot.min.css"))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/css"));
});


gulp.task("sass:docs", function () {
  return gulp.src("./docs/css/docs.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest("./docs/css"));
});

gulp.task('pug:docs', function () {
  return gulp.src(["./docs/**/*.pug", "!./docs/layout.pug"])
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
    .pipe(gulp.dest("./docs")); // tell gulp our output folder
});

gulp.task("sass", ["sass:normal", "sass:compressed","sass-no-reboot:normal", "sass-no-reboot:compressed"]);

gulp.task('scripts', [
  'ts-compile-typings',
  'js-compile-bundle',
  'js-compile-browser',
  'js-compile-browser-uglify'
]);

gulp.task('ts-compile-typings', function () {
  const tsResult = gulp.src('./js/src/*.ts')
    .pipe(debug({title: 'typings: '}))
    .pipe(tsProjectTypings());
    tsResult.dts.pipe(gulp.dest("./js/dist/typings"))
});

gulp.task('js-compile-bundle', () => {
  return rollup.rollup({
    input: './js/src/index.ts',
    plugins: [rollupTypescript({
      typescript: require('typescript')
    })]
  }).then(bundle => {
    return bundle.write({
      file: './js/dist/bundle/universal-material.umd.js',
      name: 'universal-material',
      format: 'umd',
      sourcemap: true
    });
  });
});

const jsCompileBrowserConfig = (tsProject) => {
  return gulp.src(['./js/src/quick-dialog.ts', './js/src/*.ts', '!./js/src/index.ts'])
    .pipe(replace(/import\s{.+}\sfrom\s['"].+['"];/g, ''))
    .pipe(sourcemaps.init())
    .pipe(concat('universal-material.ts'))
    .pipe(insert.transform(contents => {
      return `namespace umd { ${contents} }`;
    }))
    .pipe(tsProject());
};

gulp.task('js-compile-browser', function () {
  return jsCompileBrowserConfig(tsProjectBrowser)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("./dist/js"))
    .pipe(gulp.dest("./docs/js"))
});

gulp.task('js-compile-browser-uglify', function () {
  return jsCompileBrowserConfig(tsProjectBrowserUglify)
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("./dist/js"))
});

gulp.task('watch', function () {
  gulp.watch('./docs/**/*.pug', ['pug:docs']);
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch('./docs/css/**/*.scss', ['sass:docs']);
  gulp.watch('./js/src/*.ts', ['scripts']);
});

gulp.task('default', ['sass', 'scripts', 'pug:docs', 'sass:docs', 'watch']);

