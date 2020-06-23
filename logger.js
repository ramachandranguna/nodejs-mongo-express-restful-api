const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')

const mailerLogger = winston.createLogger()

mailerLogger.configure({
  level: 'info',
  transports: [
    new DailyRotateFile({
      filename: './storage/log/mailer-info-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
})

const requestLogger = winston.createLogger()
requestLogger.configure({
  level: 'info',
  transports: [
    new DailyRotateFile({
      filename: './storage/log/request-info-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
})

const errorLogger = winston.createLogger()

errorLogger.configure({
  level: 'error',
  transports: [
    new DailyRotateFile({
      filename: './storage/log/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
})

if (process.env.DEBUG === 'true') {
  errorLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
  requestLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

module.exports = {
  errorLogger,
  requestLogger,
  mailerLogger
}