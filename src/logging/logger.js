require('dotenv').config()

const winston = require('winston')
const SentryTransport = require('@synapsestudios/winston-sentry')
const Sentry = require('@sentry/node')

var appRoot = require('app-root-path')

Sentry.init({ dsn: process.env.DNS })

const logConfiguration = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: `${appRoot}/logs/server.log`,
      level: 'error',
      colorize: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: `${appRoot}/logs/server.log`,
      level: 'info',
      colorize: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new SentryTransport({ Sentry })
  ]
}
const logger = winston.createLogger(logConfiguration)

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green'
})

module.exports = logger
