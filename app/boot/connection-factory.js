/* eslint-disable strict */
/**
 * Created by sridharrajs on 1/13/16.
 */

'use strict'

const mongoose = require('mongoose')

const db = mongoose

db.Promise = global.Promise

class ConnectionFactory {
  static connect(config) {
    db.connect(config.mongodbUrl, {
      useNewUrlParser: true
    })
    return new Promise((resolve, reject) => {
      db.connection.on('open', () => {
        resolve('SUCCESS')
      }).on('error', err => {
        reject(err)
      })
    })
  }
}

module.exports = ConnectionFactory