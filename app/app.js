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
const config = require('../config')

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

// file-upload
app.get('/upload/signed-url', (req, res, next) => {
  const crypto = require('crypto')
  const uuid = require('node-uuid')

  // your private API key e.g. private_LKSJDFOWI101212D03120
  const privateAPIKey = config.IMAGE.pk

  // A unique key e.g. 06a7c148-e553-4a2a-80ca-10dd8ad7eb64
  const token = uuid.v4()

  // E.g. 1567317691
  // eslint-disable-next-line radix
  const expire = parseInt(Date.now() / 1000) + 2400

  // E.g. 6c6addcb8c2d1ea742701dde59e64c4ef12843c9
  const hash = crypto
    .createHmac('sha1', privateAPIKey)
    .update(token + expire)
    .digest('hex')
  res.json({
    data: {
      endpoint: {
        public_key: config.IMAGE.pb,
        hash,
        token,
        expire,
        base_url: config.IMAGE.baseURL,
      },
    },
  })
})

// // Admin User Session
// app.use("/", require("./modules/admins/routes"));

// Session
app.use('/', require('./modules/auth/routes'))

// Users
app.use('/', require('./modules/users/routes'))

// // Locations
// app.use("/", require("./modules/locations/routes"));

// // Tags
// app.use("/", require("./modules/tags/routes"));

// // Owners
// app.use("/", require("./modules/owners/routes"));

// // Stores
// app.use("/", require("./modules/stores/routes"));

// // Jobs
// app.use("/", require("./modules/jobs/routes"));

// app.use("/", require("./modules/messaging/routes"));

app.use(({ status, data }, req, res, next) => {
  res.status(status).json({
    ...data,
  })
})

module.exports = app
