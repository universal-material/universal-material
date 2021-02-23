import fiber from 'fibers';
import autoprefixer from 'gulp-autoprefixer';
import { parallel, src, dest, watch } from 'gulp';
import concat from 'gulp-concat';
import insert from 'gulp-insert';
import notify from 'gulp-notify';
import pug from 'gulp-pug';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import sourcemaps from "gulp-sourcemaps";
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify';
import rollupTypescript from 'rollup-plugin-typescript2';
import { rollup } from 'rollup';

const tsProjectBrowser = ts.createProject('./js/src/tsconfig.browser.json', {outFile: 'universal-material.js'});
const tsProjectBrowserUglify = ts.createProject('./js/src/tsconfig.browser.json', {outFile: 'universal-material.min.js'});

gulpSass.compiler = sass;

const sassNormal = () => {
  return src("./scss/universal-material.scss")
    .pipe(sourcemaps.init())
    .pipe(gulpSass({fiber: fiber}).on("error", gulpSass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./"))
    .pipe(dest("./dist/css"))
    .pipe(dest("./docs/dist/css"));
}

const sassCompressed = () => {
  return src("./scss/universal-material.scss")
    .pipe(sourcemaps.init())
    .pipe(gulpSass({
      fiber: fiber,
      outputStyle: "compressed"
    }).on("error", gulpSass.logError))
    .pipe(autoprefixer())
    .pipe(rename("universal-material.min.css"))
    .pipe(sourcemaps.write("./"))
    .pipe(dest("./dist/css"));
}

const sassNoRebootNormal = () => {
  return src("./scss/universal-material-no-reboot.scss")
    .pipe(sourcemaps.init())
    .pipe(gulpSass({fiber: fiber}).on("error", gulpSass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./"))
    .pipe(dest("./dist/css"))
}

const sassNoRebootCompressed = () => {
  return src("./scss/universal-material-no-reboot.scss")
    .pipe(sourcemaps.init())
    .pipe(gulpSass({
      fiber: fiber,
      outputStyle: "compressed"
    }).on("error", gulpSass.logError))
    .pipe(autoprefixer())
    .pipe(rename("universal-material-no-reboot.min.css"))
    .pipe(sourcemaps.write("./"))
    .pipe(dest("./dist/css"));
}

const sassDocs = () => {
  return src("./docs/src/css/docs.scss")
    .pipe(gulpSass({fiber: fiber}).on("error", gulpSass.logError))
    .pipe(autoprefixer())
    .pipe(dest("./docs/dist/css"));
}

const pugDocs = () => {
  return src(["./docs/src/**/*.pug", "!./docs/src/layout.pug"])
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
    .pipe(dest("./docs/dist")); // tell gulp our output folder
}

const jsCompileBundle = () => {
  return rollup({
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
}

const jsCompileBrowserConfig = (tsProject) => {
  return src(['./js/src/quick-dialog.ts', './js/src/*.ts', '!./js/src/index.ts'])
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
    .pipe(dest("./dist/js"))
    .pipe(dest("./docs/dist/js"))
}

const jsCompileBrowserUglify = () => {
  return jsCompileBrowserConfig(tsProjectBrowserUglify)
    .pipe(uglify())
    .pipe(dest("./dist/js"))
}

const watchDefault = () => {
  watch(['./docs/src/**/*.pug', './docs/src/**/*.html'], exports['pug:docs']);
  watch('./scss/**/*.scss', exports['sass']);
  watch('./docs/src/css/**/*.scss', exports['sass:docs']);
  watch('./js/src/*.ts', exports['scripts']);
}

const watchDocs = () => {
  watch(['./docs/src/**/*.pug', './docs/src/**/*.html'], exports['pug:docs']);
  watch('./scss/**/*.scss', exports['sass:normal']);
  watch('./docs/src/css/**/*.scss', exports['sass:docs']);
}

exports['sass:normal'] = sassNormal;
exports['sass:compressed'] = sassCompressed;
exports['sass-no-reboot:normal'] = sassNoRebootNormal;
exports['sass-no-reboot:compressed'] = sassNoRebootCompressed;
exports['sass:docs'] = sassDocs;

exports['pug:docs'] = pugDocs;

exports['js-compile-bundle'] = jsCompileBundle;
exports['js-compile-browser'] = jsCompileBrowser;
exports['js-compile-browser-uglify'] = jsCompileBrowserUglify;


exports['watch'] = watchDefault;
exports['watch:docs'] = watchDocs;

exports.sass = parallel(
  exports['sass:normal'],
  exports['sass:compressed'],
  exports['sass-no-reboot:normal'],
  exports['sass-no-reboot:compressed'])

exports.scripts = parallel(
  exports['js-compile-bundle'],
  exports['js-compile-browser'],
  exports['js-compile-browser-uglify'])

exports.default = parallel(
  exports['sass'],
  exports['scripts'],
  exports['pug:docs'],
  exports['sass:docs'],
  exports['watch'])

