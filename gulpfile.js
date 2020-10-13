const filesToWatch  = 'html,htm,txt,json,md,woff2';
const imagesToWatch = 'jpg,jpeg,png,webp,svg';
const baseDir       = 'app';
const isOnline      = true;

const paths = {
  scripts: {
    src: [
      baseDir + '/js/app.js'
    ],
    dest: baseDir + '/js',
  },

  styles: {
    src:  baseDir + '/' + "scss" + '/main.*',
    dest: baseDir + '/css',
  },

  images: {
    src:  baseDir + '/images/src/**/*',
    dest: baseDir + '/images/dest',
  },

  cssOutputName: 'styles.min.css',
  jsOutputName:  'scripts.min.js',
}

const { src, dest, parallel, series, watch } = require('gulp');
const browserSync  = require('browser-sync').create();
const scss         = require('gulp-sass');
const cleancss     = require('gulp-clean-css');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const del          = require('del');

function browsersync() {
  browserSync.init({
    server: { baseDir: baseDir + '/' },
    notify: false,
    online: isOnline
  })
}

function scripts() {
  return src(paths.scripts.src)
    .pipe(concat(paths.jsOutputName))
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream())
}

function styles() {
  return src(paths.styles.src)
    .pipe(eval(scss)())
    .pipe(concat(paths.cssOutputName))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cleancss( {level: { 1: { specialComments: 0 } }}))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream())
}

function images() {
  return src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin())
    .pipe(dest(paths.images.dest))
}

function cleanimg() {
  return del('' + paths.images.dest + '/**/*', { force: true })
}

function startwatch() {
  watch(baseDir  + '/' + "scss" + '/**/*', {usePolling: true}, styles);
  watch(baseDir  + '/images/src/**/*.{' + imagesToWatch + '}', {usePolling: true}, images);
  watch(baseDir  + '/**/*.{' + filesToWatch + '}', {usePolling: true}).on('change', browserSync.reload);
  watch([baseDir + '/js/**/*.js', '!' + paths.scripts.dest + '/*.min.js'], {usePolling: true}, scripts);
}

exports.browsersync = browsersync;
exports.styles      = styles;
exports.scripts     = scripts;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.default     = parallel(images, styles, scripts, browsersync, startwatch);
