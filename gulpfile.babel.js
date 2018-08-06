import gulp from "gulp";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import autoprefixer from "gulp-autoprefixer";
import pug from "gulp-pug";
import notify from "gulp-notify";
import ts from "gulp-typescript";
import uglify from 'gulp-uglify';

const tsProject = ts.createProject('./js/src/tsconfig.json');
const tsProjectBundle = ts.createProject('./js/src/tsconfig.json', {outFile: 'universal-material.js'});
const tsProjectBundleMinify = ts.createProject('./js/src/tsconfig.json', {outFile: 'universal-material.min.js'});


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


gulp.task('scripts', ['js-compile', 'js-compile-bundle', 'js-minify-bundle']);

gulp.task('js-compile', function () {
    return gulp.src('./js/src/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./js/dist"))
});

gulp.task('js-compile-bundle', function () {
    return gulp.src('./js/src/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProjectBundle())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./dist/js"))
        .pipe(gulp.dest("./docs/js"))
});

gulp.task('js-minify-bundle', function () {
    return gulp.src('./js/src/*.ts')
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

