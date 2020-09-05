const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const del = require('del');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const include = require('posthtml-include');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const posthtml = require('gulp-posthtml');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sync = require('browser-sync').create();
const sourcemap = require('gulp-sourcemaps');
const svgstore = require('gulp-svgstore')
const gulpWebp = require('gulp-webp');

const css = () => {
  return gulp.src('src/sass/style.scss')
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass())
  // .pipe(postcss([ autoprefixer() ]))
  // .pipe(csso())
  // .pipe(rename('style.min.css'))
  .pipe(sourcemap.write('.'))
  .pipe(gulp.dest('dist/css'))
  .pipe(sync.stream());
}

const server = () => {
  sync.init({
    server: 'dist/',
    notify: false,
    open: false,
    cors: true,
    ui: false
  });

  gulp.watch('src/sass/**/*.{scss,sass}', gulp.series(css));
  gulp.watch('src/js/*.js', gulp.series(js, refresh));
  gulp.watch('src/img/icon-*.svg', gulp.series(sprite, html, refresh));
  gulp.watch('src/*.html', gulp.series(html, refresh));
}

const refresh = (done) => {
  sync.reload();
  done();
}

const images = () => {
  return gulp.src('dist/img/**/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest('dist/img'));
}

const webp = () => {
  return gulp.src('src/img/**/*.{png,jpg}')
  .pipe(gulpWebp({quality: 90}))
  .pipe(gulp.dest('src/img'));
}

const sprite = () => {
  return gulp.src('src/img/icon-*.svg')
  .pipe(svgstore({inlineSvg: true}))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('dist/img'));
}

const html = () => {
  return gulp.src('src/*.html')
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({
    removeComments: true,
    collapseWhitespace: true,
  }))
  .pipe(gulp.dest('dist'));
}

const copy = () => {
  return gulp.src([
    'src/fonts/**/*.{woff,woff2}',
    'src/img/**',
    'src//*.ico'
  ], {
    base: 'src'
  })
  .pipe(gulp.dest('dist'));
}

const js = () => {
  return gulp.src([
    'src/js/**/*'
  ], {
    base: 'src'
  })
  .pipe(gulp.dest('dist'));
}

const clean = () => {
  return del('dist');
}

const build = gulp.series(
  clean,
  copy,
  css,
  js,
  sprite,
  html,
);

const start = gulp.series(
  build,
  server,
);

exports.webp = webp;
exports.images = images;
exports.sprite = sprite;
exports.build = build;
exports.start = start;
