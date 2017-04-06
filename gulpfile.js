'use strict'

/*
Copyright 2017 Gamempire. All rights reserved.


gulp serve 								to launch server, watch and electron for dev
gulp package-windows build-production  	to package Windows applicaion. Will be packaged to ./release/windows.zip
gulp package-osx build-production 		to package MacOSx applicaion. Will be packaged in ./release/??
gulp package-linux build-production 	to package Linux application. Will be packaged to ./release/linux.zip

*/

const gulp = require('gulp')
const source = require('vinyl-source-stream')
const browserify = require('browserify')
const glob = require('glob')
const es = require('event-stream')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const eslint = require('gulp-eslint')
const rename = require('gulp-rename')
const useref = require('gulp-useref')
const replace = require('gulp-replace')
const electron = require('electron-connect').server.create()
const electronPackager = require('gulp-atom-electron')
const symdest = require('gulp-symdest')
const zip = require('gulp-vinyl-zip')
const electronInstaller = require('electron-winstaller');

const electronVersion = require('electron/package.json').version

/* These are the building tasks! */

gulp.task('build-client-bundles', (done) => {
  glob('./app/js/*.js', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return browserify({ entries: [entry] })
        .transform('babelify', { presets: [ 'es2015', 'react' ] })
        .bundle()
        .pipe(source(entry))
        .pipe(rename({
          dirname: 'js'
        }))
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
})

gulp.task('build-client-scss', (done) => {
  glob('./app/scss/*.scss', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(sass())
        .pipe(rename({
          dirname: 'css'
        }))
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
})

gulp.task('build-client-html', (done) => {
  glob('./app/*.html', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
})

gulp.task('build-client-html-production', (done) => {
  glob('./app/*.html', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(useref())
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
})

gulp.task('build-client-assets', (done) => {
  glob('./app/img/*', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      console.log(entry)
      return gulp.src(entry)
        .pipe(rename({
          dirname: 'img'
        }))
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
})

gulp.task('build-client-widget-pictures', (done) => {
  glob('./app/img/widget_img/**', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      console.log(entry)
      return gulp.src(entry)
        .pipe(rename({
          dirname: 'widget_img'
        }))
        .pipe(gulp.dest('./build/img/'))
    })

    es.merge(tasks).on('end', done)
  })
})

gulp.task('build-client', ['build-client-bundles', 'build-client-scss', 'build-client-html', 'build-client-assets', 'build-client-widget-pictures'])

gulp.task('build-client-production', ['build-client-bundles', 'build-client-scss', 'build-client-html-production', 'build-client-assets', 'build-client-widget-pictures'])

gulp.task('build-server', (done) => {
  glob('./src/*.js', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(gulp.dest('./build'))
    })

    es.merge(tasks).on('end', done)
  })
})

gulp.task('build', ['build-client', 'build-server'])

gulp.task('build-production', ['build-client-production', 'build-server'], () => {
  gulp.src('./package.json')
    .pipe(replace('build/index.js', 'index.js'))
    .pipe(gulp.dest('./build'))
})

/* These are the watch tasks! */

gulp.task('watch-client', () => {
  gulp.watch('./app/**/*', ['build-client'], (e) => {
    console.log('Client file ' + e.path + ' was ' + e.type + ', rebuilding...')
  })
})

gulp.task('watch-server', () => {
  gulp.watch('./src/**/*', ['build-server'], (e) => {
    console.log('Server file ' + e.path + ' was ' + e.type + ', rebuilding...')
  })
})

gulp.task('watch', ['watch-client', 'watch-server'])

/* These are the linting tasks! */

gulp.task('lint-client', (done) => {
  glob('./app/**/*.js', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(eslint())
        .pipe(eslint.format())
    })

    es.merge(tasks).on('end', done)
  })
})

gulp.task('lint-server', (done) => {
  glob('./src/**/*.js', (err, files) => {
    if (err) done(err)

    let tasks = files.map((entry) => {
      return gulp.src(entry)
        .pipe(eslint())
        .pipe(eslint.format())
    })

    es.merge(tasks).on('end', done)
  })
})

gulp.task('lint', ['lint-client', 'lint-server'])

/* This is the serve task! */

gulp.task('serve', ['build', 'watch'], () => {
  electron.start()
  gulp.watch('./build/index.js', electron.restart)
  gulp.watch(['./build/js/*.js', './build/css/*.css'], electron.reload)
})

/* These are the packaging tasks! */

gulp.task('package-osx', ['build-production'], () => {
  return gulp.src('./build/**')
    .pipe(electronPackager({ version: electronVersion, platform: 'darwin' }))
    .pipe(symdest('release'))
})

gulp.task('package-windows', ['build-production'], () => {
  return gulp.src('./build/**')
    .pipe(electronPackager({ version: electronVersion, platform: 'win32' ,arcg:'all'}))
    .pipe(gulp.dest('./release/windows'))
})

gulp.task('package-linux', ['build-production'], () => {
  return gulp.src('./build/**')
    .pipe(electronPackager({ version: electronVersion, platform: 'linux' }))
    .pipe(zip.dest('./release/linux.zip'))
})

gulp.task('package', ['build-production', 'package-windows', 'package-osx', 'package-linux'])


gulp.task('wininstall', ['build-production'],()=>{
  var resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './build/windows',
    outputDirectory: './release/',
    authors: 'Gamempire',
    exe: 'Gamempire.exe'
  });
  resultPromise.then();
})