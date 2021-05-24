const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
var rename = require('gulp-rename');
const del = require("del");
const cleanCSS = require('gulp-clean-css');

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

const minifyCSS = () => {
  return gulp.src('source/css/*.css')
    .pipe(cleanCSS({debug: true}, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
  .pipe(gulp.dest('build/css'));
};

exports.minifyCSS = minifyCSS

// HTML

const html = () => {
  return gulp.src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
}

exports.html = html;

// Pictures
// JPG,PNG,SVG


const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
      .pipe(imagemin([
          imagemin.optipng({optimizationLevel: 3}),
        ]))
     .pipe(gulp.dest("build/img"))
 }
exports.images = images;

//WebP

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}
exports.createWebp = createWebp;

//SVG

const sprite = () => {
  return gulp.src("source/img/element/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);


// clean

const clean = () => {
    return del("build");
};

exports.clean = clean;


// copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/favicon_io/*.ico",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
done(); }

exports.copy = copy


//build

const build = gulp.series(
  clean,
  copy,
  images,
  gulp.parallel(
  styles,
  minifyCSS,
  html,
  createWebp,
  sprite,
),
);

exports.build = build

