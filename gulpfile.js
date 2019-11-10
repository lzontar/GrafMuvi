// logger
const logger = require('./src/logging/logger')
var exec = require('child_process').exec;

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

//start in development mode
gulp.task('dev', () => {
  return exec('pm2 start ./src/api/server.js --watch', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

//pm2 Status
gulp.task('status', () => {
  return exec('pm2 status', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
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
  return gulp.src(['./src'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
}
//standard lint fix
gulp.task('fix-lint', () => {
  return exec('standard --fix ./src', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

//babel build
gulp.task('fix-lint', () => {
  return exec('babel src --out-dir dist', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

gulp.task('pretest', pretest)
