const { check } = require('express-validator/check')
const _ = require('lodash')
const mongoose = require('mongoose')

const email = [
  check('email')
    .exists()
    .withMessage('Email is required.'),
]

const password = [
  check('password')
    .exists()
    .withMessage('Password is required.'),
]

module.exports = {
  email,
  password,
}
