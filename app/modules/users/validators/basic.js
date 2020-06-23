const { check } = require('express-validator/check')
const _ = require('lodash')
const mongoose = require('mongoose')

const User = mongoose.model('user')
const Auth = mongoose.model('auth')

const firstName = [
  check('first_name')
    .exists()
    .withMessage('First name is required.'),
  check('first_name').custom(fName => {
    if (_.isEmpty(fName && fName.trim())) {
      return Promise.reject(new Error("First name can't be empty."))
    }
    return Promise.resolve()
  }),
]

const lastName = [
  check('last_name')
    .exists()
    .withMessage('Last name is required.'),
  check('last_name').custom(fName => {
    if (_.isEmpty(fName && fName.trim())) {
      return Promise.reject(new Error("Last name can't be empty."))
    }
    return Promise.resolve()
  }),
]

const email = [
  check('email')
    .exists()
    .withMessage('Email is required.'),
  check('email')
    .isEmail()
    .withMessage('Enter a valid email.'),
]

const emailExist = [
  check('email').custom(async (_email, { req }) => {
    const recordCount = await Auth.countDocuments({
      email: _email,
    })
    if (recordCount > 0) {
      req.customStatus = 409
      return Promise.reject(new Error('Email is already exist'))
    }
    return Promise.resolve()
  }),
]

const password = [
  check('password')
    .isLength({
      min: 4,
      max: 30,
    })
    .withMessage('Password should be minimum of 6 characters'),
]

module.exports = {
  firstName,
  lastName,
  email,
  emailExist,
  password,
}
