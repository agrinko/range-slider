import gulp from "gulp";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import cleanCSS from "gulp-clean-css";

gulp.task("default", ["build"]);

gulp.task("build", ["babel", "minify-css"], () => {
    return gulp.src([
            "src/*.js",
            "!src/*.min.js"
        ])
        .pipe(uglify({
            preserveComments: "license",
            wrap: true // to prevent Babel's helpers from being exported as globals
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("src"));
});

gulp.task("babel", () => {
    return gulp.src("src/*.es6")
        .pipe(babel())
        .pipe(gulp.dest("src"));
});

gulp.task("minify-css", () => {
    return gulp.src([
            "css/*.css",
            "!css/*.min.css"
        ])
        .pipe(cleanCSS({
            debug: true,
            compatibility: "ie9"
        }, (details) => {
            console.log(details.name + ": " + details.stats.originalSize);
            console.log(details.name + ": " + details.stats.minifiedSize);
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("css"));
});