import autoprefixer from "gulp-autoprefixer";
import gulp from "gulp";
import notify from "gulp-notify";
import pug from "gulp-pug";
import rename from "gulp-rename";
import replace from "gulp-replace";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import ts from "gulp-typescript";
import uglify from 'gulp-uglify';

const tsProjectEs5 = ts.createProject('./js/src/tsconfig.es5.json');
const tsProjectEs2015 = ts.createProject('./js/src/tsconfig.es2015.json');
const tsProjectTypings = ts.createProject('./js/src/tsconfig.types.json');
const tsProjectBundle = ts.createProject('./js/src/tsconfig.bundle.json', {outFile: 'universal-material.js'});
const tsProjectBundleMinify = ts.createProject('./js/src/tsconfig.bundle.json', {outFile: 'universal-material.min.js'});


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


gulp.task("sass:docs", function () {
    return gulp.src("./docs/css/docs.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest("./docs/css"));
});

gulp.task('pug:docs', function() {
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

gulp.task("sass", ["sass:normal", "sass:compressed"]);

gulp.task('scripts', ['ts-compile', 'ts-compile-typings', 'js-compile-bundle', 'js-minify-bundle']);

gulp.task('ts-compile', ['ts-compile-es5', 'ts-compile-es2015']);

gulp.task('ts-compile-es5', function () {
    return gulp.src(['./js/src/*.ts', '!./js/src/index.ts'])
        .pipe(replace('export class', 'class'))
        .pipe(sourcemaps.init())
        .pipe(tsProjectEs5())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./js/dist/es5"))
});

gulp.task('ts-compile-es2015', function () {
    return gulp.src('./js/src/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProjectEs2015())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./js/dist/es2015"))
});

gulp.task('ts-compile-typings', function () {
    return gulp.src('./js/src/*.ts')
        .pipe(tsProjectTypings(ts.reporter.fullReporter()))
        .pipe(gulp.dest("./js/dist/typings"))
});

gulp.task('js-compile-bundle', function () {
    return gulp.src(['./js/src/*.ts', '!./js/src/index.ts'])
        .pipe(replace('export class', 'class'))
        .pipe(sourcemaps.init())
        .pipe(tsProjectBundle())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./dist/js"))
        .pipe(gulp.dest("./docs/js"))
});

gulp.task('js-minify-bundle', function () {
    return gulp.src(['./js/src/*.ts', '!./js/src/index.ts'])
        .pipe(replace('export class', 'class'))
        .pipe(sourcemaps.init())
        .pipe(tsProjectBundleMinify())
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

