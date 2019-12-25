// logger
const logger = require('./src/logging/logger')
var exec = require('child_process').exec;

// gulp dependencies
const gulp = require('gulp')
var jest = require('gulp-jest').default
// var exec = require('child_process').exec;
var standard = require('gulp-standardjs')

const pm2 = require('pm2')

gulp.task('start', done => {
  return exec('pm2 start ./server.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

//start in development mode
gulp.task('dev', () => {
  return exec('pm2 start ./server.js --watch', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

//pm2 Status
gulp.task('status', () => {
  return exec('pm2 ls', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

gulp.task('restart', () => {
  return exec('pm2 restart server', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

gulp.task('stop', () => {
  return exec('pm2 stop server', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

gulp.task('test', () => {
  pretest()
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
gulp.task('build', () => {
  return pretest()
  .pipe(exec('babel src --out-dir dist', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  }));
})

gulp.task('pretest', pretest)

//start in development mode
gulp.task('vm', () => {
  return exec('vagrant up --provider azure --no-provision', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

//start in development mode
gulp.task('provision', () => {
  return exec('vagrant provision', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

gulp.task('production-deploy', () => {
  return exec('cd despliegue && cap production deploy', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

gulp.task('deploy-from-zero', () => {
  return exec('vagrant up --no-provision && vagrant provision && cd despliegue && cap production deploy', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})
