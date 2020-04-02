import autoprefixer from 'gulp-autoprefixer';
import { gulp, parallel, src, dest, watch } from 'gulp';
import concat from 'gulp-concat';
import insert from 'gulp-insert';
import notify from 'gulp-notify';
import pug from 'gulp-pug';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import sass from 'gulp-sass';
import sourcemaps from "gulp-sourcemaps";
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify';
import rollupTypescript from 'rollup-plugin-typescript2';
import { rollup } from 'rollup';

const tsProjectBrowser = ts.createProject('./js/src/tsconfig.browser.json', {outFile: 'universal-material.js'});
const tsProjectBrowserUglify = ts.createProject('./js/src/tsconfig.browser.json', {outFile: 'universal-material.min.js'});

exports['sass:normal'] = () => {
  return src("./scss/universal-material.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./"))
    .pipe(dest("./dist/css"))
    .pipe(dest("./docs/dist/css"));
}

exports['sass:compressed'] = () => {
  return src("./scss/universal-material.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "compressed"
    }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(rename("universal-material.min.css"))
    .pipe(sourcemaps.write("./"))
    .pipe(dest("./dist/css"));
}

exports['sass-no-reboot:normal'] = () => {
  return src("./scss/universal-material-no-reboot.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./"))
    .pipe(dest("./dist/css"))
}

exports['sass-no-reboot:compressed'] = () => {
  return src("./scss/universal-material-no-reboot.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "compressed"
    }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(rename("universal-material-no-reboot.min.css"))
    .pipe(sourcemaps.write("./"))
    .pipe(dest("./dist/css"));
}


exports['sass:docs'] = () => {
  return src("./docs/src/css/docs.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(dest("./docs/dist/css"));
}

exports['pug:docs'] = () => {
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

exports['js-compile-bundle'] = () => {
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

exports['js-compile-browser'] = () => {
  return jsCompileBrowserConfig(tsProjectBrowser)
    .pipe(dest("./dist/js"))
    .pipe(dest("./docs/dist/js"))
}

exports['js-compile-browser-uglify'] = () => {
  return jsCompileBrowserConfig(tsProjectBrowserUglify)
    .pipe(uglify())
    .pipe(dest("./dist/js"))
}

exports['watch'] = () => {
  watch(['./docs/src/**/*.pug', './docs/src/**/*.html'], exports['pug:docs']);
  watch('./scss/**/*.scss', exports['sass']);
  watch('./docs/src/css/**/*.scss', exports['sass:docs']);
  watch('./js/src/*.ts', exports['scripts']);
}

exports['watch:docs'] = () => {
  watch(['./docs/src/**/*.pug', './docs/src/**/*.html'], exports['pug:docs']);
  watch('./scss/**/*.scss', exports['sass:normal']);
  watch('./docs/src/css/**/*.scss', exports['sass:docs']);
}

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

