var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var clean       = require('gulp-clean');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var browserSync = require('browser-sync').create();

var sassPaths = [
  'node_modules/tingle.js/dist/tingle.css'
];

var scriptPaths = [
  "./node_modules/jquery/dist/jquery.min.js",
  "./node_modules/tingle.js/dist/tingle.min.js"
];

gulp.task('styles', function() {
  return gulp.src('assets/styles/app.scss')
    .pipe($.sass({
      includePaths: sassPaths,
      outputStyle: 'compressed'
    })
    .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function(){
  return gulp.src
      (['assets/scripts/app.js'])
      .pipe(concat('app.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe($.uglify())
      .pipe(gulp.dest('dist/scripts'));
});

gulp.task('vendor-scripts', function() {
  return gulp.src( scriptPaths )
  .pipe(concat('vendor.js'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('dist/scripts'));
});

gulp.task('clean-fonts', function() {
  return gulp.src('dist/fonts', {read: false})
    .pipe(clean());
});

gulp.task('fonts', ['clean-fonts'], function(){
  return gulp.src('assets/fonts/*')
      .pipe($.flatten())
      .pipe(gulp.dest('dist/fonts'))
      .pipe(browserSync.stream());
});

gulp.task('clean-images', function() {
  return gulp.src('dist/images', {read: false})
    .pipe(clean());
});

gulp.task('images', ['clean-images'], function () {
  return gulp.src('assets/images/**/*')
    .pipe(gulp.dest('dist/images'));
});

gulp.task('build', ['images', 'styles', 'scripts', 'fonts', 'vendor-scripts']);

gulp.task('watch', function() {
  gulp.watch(['assets/styles/**/*.scss'], ['styles']);
  gulp.watch(['assets/scripts/**/*.js'], ['scripts']);
  gulp.watch(['assets/images/**/*'], ['images']);
  gulp.watch(['assets/fonts/**/*'], ['fonts']);
  gulp.watch(['./*.php', './sections/*.php']).on('change', browserSync.reload);

  gulp.task['vendor-scripts'];
});

gulp.task('default', ['build', 'watch']);