// logger
const logger = require('./src/logging/logger')

// gulp dependencies
const gulp = require('gulp')
var jest = require('gulp-jest').default
// var exec = require('child_process').exec;
var standard = require('gulp-standardjs')

const pm2 = require('pm2')

gulp.task('start', () => {
  pm2.connect(false, function (err) {
    if (err) {
      logger.error(err)
      process.exit(2)
    }

    pm2.start({
      name: 'GrafMuvi',
      script: './src/api/server.js',
      instances: 1
    }, function (err) {
      if (err) {
        throw err
      }
      logger.info('Starting GrafMuvi server.')
    })
  })
  pm2.disconnect()
})

gulp.task('restart', () => {
  pm2.connect(false, function (err) {
    if (err) {
      logger.error(err)
      process.exit(2)
    }

    pm2.restart({
      name: 'GrafMuvi',
      script: './src/api/server.js',
      instances: 1
    }, function (err) {
      if (err) {
        throw err
      }
      logger.info('Restarting GrafMuvi server.')
    })
  })
  pm2.disconnect()
})

gulp.task('stop', () => {
  pm2.connect(false, function (err) {
    if (err) {
      logger.error(err)
      process.exit(2)
    }

    pm2.stop('GrafMuvi', function (err) {
      if (err) {
        throw err
      }
      logger.info('Stopping GrafMuvi server.')
    })
  })
  pm2.disconnect()
})

gulp.task('test', () => {
  return gulp.src('__test__').pipe(jest({
    detectOpenHandles: true,
    automock: false
  }))
})

function pretest () {
  return gulp.src(['./src/structure/*.js', './src/api/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
}

gulp.task('pretest', pretest)
