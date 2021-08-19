/**
 * @author Ramachandran Gunasekeran
 * @email ramachandrangunasekeran@gmail.com
 * @create date 2019-11-23 22:28:17
 * @modify date 2019-11-23 22:28:17
 * @desc [description]
 */
const bp = require('body-parser')
const cors = require('cors')
const express = require('express')
const compression = require('compression')
const expressValidator = require('express-validator')
const helmet = require('helmet')
const responseTime = require('response-time')
const moment = require('moment')
const logger = require('../logger')

const app = express()
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(bp.json())
app.use(
  bp.urlencoded({
    extended: false,
  })
)

// Log response time for each request
app.use(
  responseTime((req, res, time) => {
    // eslint-disable-next-line no-param-reassign
    time = time.toFixed(2)
    const ip = req.headers['x-real-ip'] || req.ip
    logger.requestLogger.info(
      `${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')} ${ip} => ${
        req.method
      } => ${req.originalUrl} => ${res.statusCode} => ${time}ms`
    )
    res.set('X-Response-Time', `${time}ms`)
  })
)

app.use(expressValidator())

app.use(require('./boot/cors-header'))

// // Admin User Session
// app.use("/", require("./modules/admins/routes"));

// Session
app.use('/', require('./modules/auth/routes'))

// Users
app.use('/', require('./modules/users/routes'))

app.use(({ status, data }, req, res, next) => {
  res.status(status).json({
    ...data,
  })
})

module.exports = app
