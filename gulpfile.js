var gulp = require("gulp");
var sass = require("gulp-sass");
var rename = require("gulp-rename");
var autoprefixer = require("gulp-autoprefixer");
var pug = require("gulp-pug");
var notify = require('gulp-notify');


gulp.task("sass:normal", function () {
    return gulp.src("./sass/octopus-material.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest("./dist/css"));
});

gulp.task("sass:compressed", function () {
    return gulp.src("./sass/octopus-material.scss")
        .pipe(sass({
            outputStyle: "compressed"
        }).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(rename("octopus-material.min.css"))
        .pipe(gulp.dest("./dist/css"));
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

gulp.task('watch', function () {
    gulp.watch('./docs/**/*.pug', ['pug:docs']);
    gulp.watch('./sass/**/*.scss', ["sass"]);
});


gulp.task("default", ["sass", "pug:docs", "watch"]);

