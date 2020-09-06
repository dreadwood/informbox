const autoprefixer = require('autoprefixer');
const del = require('del');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sync = require('browser-sync').create();
const sourcemap = require('gulp-sourcemaps');
const svgstore = require('gulp-svgstore');
const concat = require('gulp-concat');
const order = require('gulp-order');

const css = () => {
  return gulp.src('src/sass/style.scss')
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(postcss([ autoprefixer() ]))
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

const sprite = () => {
  return gulp.src('src/img/icon-*.svg')
  .pipe(svgstore({inlineSvg: true}))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('dist/img'));
}

const html = () => {
  return gulp.src('src/*.html')
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
  return gulp.src('src/js/**/*')
  .pipe(order([
    'load.js',
    'render.js',
    'state.js',
    'index.js',
  ]))
  .pipe(concat("script.js"))
  .pipe(gulp.dest('dist/js'));
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

exports.sprite = sprite;
exports.build = build;
exports.start = start;
