/**
 * Created by ramachandrang.
 */

const { validationResult } = require('express-validator/check')
const { ValidationResponse } = require('./response.extension')

class RequestValidator {
  static validate(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(
        ValidationResponse(req.customStatus || 422).set(errors.array())
      )
    }
    return next()
  }
}

module.exports = RequestValidator
